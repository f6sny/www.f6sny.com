import { getAuthenticatedClient } from '@/lib/api';

// Inside your component function
const handleSubmit = async (values: any) => {
  const client = getAuthenticatedClient();
  
  try {
    const response = await client.collection('jokes').create({
      data: {
        title: values.title,
        content: values.content,
        // other fields...
      }
    });
    
    // Handle success
  } catch (error) {
    // Handle error
  }
}; 