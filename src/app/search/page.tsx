"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

// This should be replaced with an API call in a real application
import jokesData from "@/data/jokes.json"

export default function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q")

  const searchResults = jokesData.filter((joke) => joke.content.toLowerCase().includes(query?.toLowerCase() ?? ""))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Search Results for "{query}"</h1>
      {searchResults.length === 0 ? (
        <p>No jokes found matching your search.</p>
      ) : (
        searchResults.map((joke) => (
          <Card key={joke.id}>
            <CardHeader>
              <CardTitle>
                <Link href={`/jokes/${joke.slug}`} className="hover:underline">
                  {joke.content.split("\n")[0]}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{joke.content.split("\n").slice(1).join("\n")}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

