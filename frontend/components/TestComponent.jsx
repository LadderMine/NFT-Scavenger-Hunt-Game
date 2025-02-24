"use client";

import { useQuery } from "@tanstack/react-query";

function fetchData() {
  return fetch("https://jsonplaceholder.typicode.com/todos/1").then((res) =>
    res.json()
  );
}

export default function TestComponent() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["testData"],
    queryFn: fetchData,
  });

  if (isLoading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">Error fetching data</p>;

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg">
      <h2 className="text-lg font-bold">Fetched Data:</h2>
      <pre className="mt-2 p-2 bg-gray-900 rounded-md">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
