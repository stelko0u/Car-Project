import { getAuth } from "firebase/auth";
export default function Home() {
  const auth = getAuth();

  return (
    <>
      <h1>Home</h1>
    </>
  );
}
