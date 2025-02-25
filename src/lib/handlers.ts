import { toast } from "@/hooks/use-toast"
import confetti from "canvas-confetti"
import client from "@/lib/api"

export class JokeHandlers {
  /**
   * Handle reaction to a joke
   * @param jokeId The ID of the joke
   * @param reaction The reaction type ("laugh", "meh", or "frown")
   * @param updateState A callback to update the component state
   */
  static async handleReaction(
    jokeId: string, 
    reaction: string, 
    updateState: (jokeId: string, voteValue: string, oldVotes: any[]) => void
  ) {
    try {
      const votes = client.collection('votes');
      const voteValue = reaction === "laugh" ? "up" : reaction === "meh" ? "neutral" : "down";
      
      // Get the current joke from the API to ensure we have the latest data
      const jokeData = await client.collection('jokes').findOne(jokeId);
      const currentJoke = jokeData.data;

      if (currentJoke?.hasVoted && currentJoke?.userVote) {
        await votes.update(currentJoke.userVote.documentId, {
          value: voteValue
        });
      } else {
        await votes.create({
          value: voteValue,
          joke: jokeId
        });
      }

      // Get the votes array to pass to the update function
      const oldVotes = [...(currentJoke.votes || [])];
      
      // Call the update function provided by the component
      updateState(jokeId, voteValue, oldVotes);

      // Show confetti for positive reactions
      if (reaction === "laugh") {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
      
      toast({
        title: "تم التصويت بنجاح",
        description: "شكراً لك على مشاركتك!",
      });
    } catch (error) {
      console.error('Failed to vote:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء التصويت، الرجاء المحاولة مرة أخرى",
        variant: "destructive"
      });
      throw error; // Re-throw to allow components to handle the error
    }
  }

  /**
   * Handle reporting a joke
   * @param jokeId The ID of the joke to report
   */
  static handleReport(jokeId: number) {
    // In a real implementation, this would call an API endpoint
    toast({
      title: "تم التبليغ",
      description: "شكراً لك! سنراجع المحتوى قريباً.",
    });
  }

  /**
   * Update state helper for single joke view
   */
  static getSingleJokeUpdater(setJoke: React.Dispatch<React.SetStateAction<any>>) {
    return (jokeId: string, voteValue: string, oldVotes: any[]) => {
      setJoke((prev: any) => {
        if (prev.documentId !== jokeId) return prev;
        
        // Update votes array
        if (prev.hasVoted) {
          // Remove old vote
          const oldVoteValue = prev.userVote?.value;
          const oldVoteIndex = oldVotes.findIndex(v => v.value === oldVoteValue);
          if (oldVoteIndex > -1) oldVotes.splice(oldVoteIndex, 1);
        }
        // Add new vote
        oldVotes.push({ value: voteValue });

        return {
          ...prev,
          hasVoted: true,
          userVote: { value: voteValue },
          votes: oldVotes
        };
      });
    };
  }

  /**
   * Update state helper for joke list views
   */
  static getJokeListUpdater(setJokes: React.Dispatch<React.SetStateAction<any[]>>) {
    return (jokeId: string, voteValue: string, oldVotes: any[]) => {
      setJokes(prev => prev.map(joke => {
        if (joke.documentId !== jokeId) return joke;
        
        // Update votes array
        if (joke.hasVoted) {
          // Remove old vote
          const oldVoteValue = joke.userVote?.value;
          const oldVoteIndex = oldVotes.findIndex(v => v.value === oldVoteValue);
          if (oldVoteIndex > -1) oldVotes.splice(oldVoteIndex, 1);
        }
        // Add new vote
        oldVotes.push({ value: voteValue });

        return {
          ...joke,
          hasVoted: true,
          userVote: { value: voteValue },
          votes: oldVotes
        };
      }));
    };
  }
}
