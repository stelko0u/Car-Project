import React, { useState, useEffect, useContext } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import CarBox from "../../components/CarBox/CarBox";

export default function Profile() {
  const { isAuthenticated } = useContext(AuthContext); // Проверяваме дали потребителят е влязъл
  const [likedCars, setLikedCars] = useState([]); // Състояние за харесаните коли
  const [loading, setLoading] = useState(true); // За зареждане на данните
  const auth = getAuth(); // За да вземем текущия потребител
  const db = getFirestore();
  const navigate = useNavigate();

  // Зареждаме харесаните коли от Firestore
  useEffect(() => {
    const fetchLikedCars = async () => {
      if (!isAuthenticated) {
        return; // Ако не сме влезли, няма как да показваме харесаните коли
      }

      console.log(auth.currentUser);
      const userId = auth.currentUser.uid;
      const carsRef = collection(db, "cars");
      const q = query(carsRef, where("likes", "array-contains", userId)); // Търсим коли, които съдържат ID на потребителя в likes масива

      try {
        const querySnapshot = await getDocs(q);
        const cars = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLikedCars(cars); // Записваме харесаните коли в състоянието
      } catch (error) {
        console.error("Error fetching liked cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedCars();
  }, [isAuthenticated, auth, db]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div>
        <p>You need to log in to view your liked cars.</p>
      </div>
    );
  }

  if (likedCars.length === 0) {
    return <div>You haven't liked any cars yet.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Liked Cars</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {likedCars.map((car) => (
          <CarBox key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
}
