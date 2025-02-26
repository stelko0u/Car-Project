import { getAuth } from "firebase/auth";
export default function Home() {
  const auth = getAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Home Page</h1>
    </div>
  );
}
