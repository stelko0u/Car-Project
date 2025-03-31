import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, deleteDoc, increment, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { Heart, HeartOff, PencilLine, Trash2 } from "lucide-react";
import { AuthContext } from "../../Context/AuthContext";
import { FaRegHeart, FaHeart } from "react-icons/fa";

export default function Details() {
  const { isAuthenticated } = useContext(AuthContext);
  const { id: carId } = useParams();
  const [car, setCar] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const db = getFirestore();
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLike = async () => {
    if (!isAuthenticated) return;

    const carRef = doc(db, "cars", carId);
    const carSnapshot = await getDoc(carRef);

    if (carSnapshot.exists()) {
      const carData = carSnapshot.data();
      const userId = auth.currentUser.uid;

      let updatedLikes = [...(carData.likes || [])];

      if (liked) {
        updatedLikes = updatedLikes.filter((id) => id !== userId);
      } else {
        updatedLikes.push(userId);
      }

      await updateDoc(carRef, {
        likes: updatedLikes,
      });

      setCar((prevCar) => ({
        ...prevCar,
        likes: updatedLikes,
      }));

      setLiked(!liked);
    }
  };

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const carDocRef = doc(db, "cars", carId);
        const carSnapshot = await getDoc(carDocRef);

        if (carSnapshot.exists()) {
          const carData = carSnapshot.data();
          setCar(carData);
          console.log(carData.likes.length);

          onAuthStateChanged(auth, (user) => {
            if (user && carData.likes && carData.likes.includes(user.uid)) {
              setLiked(true); // Ако текущият потребител е харесал, поставяме `liked` на true
            }
          });

          if (user && user.email === carData.owner) {
            setIsOwner(true);
          }
        } else {
          console.error("Car does not exist.");
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [carId, db, auth]);
  // useEffect(() => {
  //   const fetchCarDetails = async () => {
  //     try {
  //       const carDocRef = doc(db, "cars", carId);
  //       const carSnapshot = await getDoc(carDocRef);

  //       if (carSnapshot.exists()) {
  //         const carData = carSnapshot.data();
  //         setCar(carData);

  //         onAuthStateChanged(auth, (user) => {
  //           if (user && user.email === carData.owner) {
  //             setIsOwner(true);
  //           }
  //         });
  //       } else {
  //         console.error("Car does not exist.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching car details:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCarDetails();
  // }, [carId, db, auth]);

  const handleEdit = () => {
    navigate(`/edit/${carId}`);
  };

  const handleDelete = async () => {
    try {
      const carDocRef = doc(db, "cars", carId);
      await deleteDoc(carDocRef);
      navigate("/catalog");
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  const incrementViews = async (carId) => {
    const carRef = doc(db, "cars", carId);
    await updateDoc(carRef, {
      views: increment(1),
    });

    const updatedCarSnapshot = await getDoc(carRef);
    if (updatedCarSnapshot.exists()) {
      setCar(updatedCarSnapshot.data());
    }
  };

  useEffect(() => {
    if (carId) {
      incrementViews(carId);
    }
  }, [carId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!car) {
    return <div>Car not found.</div>;
  }

  return (
    <div className="p-4">
      <div className="bg-white p-6">
        <div className="flex flex-col gap-8 lg:gap-0 lg:flex-row justify-between">
          <div className="max-w-2xl">
            <Carousel
              showArrows={true}
              showThumbs={false}
              dynamicHeight={false}
              autoPlay={false}
              infiniteLoop={true}
              selectedItem={selectedIndex}
              onChange={(index) => setSelectedIndex(index)}
              className="max-h-96"
            >
              {car.photos.map((photoUrl, index) => (
                <div key={index}>
                  <img
                    src={photoUrl}
                    alt={`Car photo ${index + 1}`}
                    className="object-cover size-full h-96"
                  />
                </div>
              ))}
            </Carousel>
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {car.photos.map((photoUrl, index) => (
                <img
                  key={index}
                  src={photoUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-16 h-16 object-cover cursor-pointer border-2 rounded-md ${
                    selectedIndex === index ? "border-blue-500" : "border-gray-300"
                  }`}
                  onClick={() => setSelectedIndex(index)}
                />
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 text-slate-600 flex justify-between">
            <span>
              <h1 className="text-2xl font-bold">
                {car.brand} {car.model}
              </h1>
              <p>Year: {car.year}</p>
              <p>Power: {car.power} HP</p>
              <p>Price: ${car.price}</p>
              <p>Engine: {car.fuelType}</p>
              <p>Gearbox: {car.gearbox}</p>
              <p>Phone number: {car.phone}</p>
              <p>Owner: {car.owner}</p>
              <p>Views: {car.views}</p>
            </span>
            <span>
              <span className="flex justify-center items-center gap-2">
                {isAuthenticated && (
                  <button onClick={handleLike} className="hover:scale-105 duration-300">
                    {liked ? (
                      <span className="flex items-center gap-2">
                        <p className="text-lg">{car.likes.length}</p>
                        <FaHeart color="red" size={26} />
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <p className="text-lg">{car.likes.length}</p>
                        <FaRegHeart color="red" size={26} />
                      </span>
                    )}
                  </button>
                )}
                {isOwner && isAuthenticated && (
                  <div className="flex gap-2">
                    <button onClick={handleEdit}>
                      <PencilLine color="orange" />
                    </button>
                    <button onClick={() => setIsModalOpen(true)}>
                      <Trash2 color="red" />
                    </button>
                  </div>
                )}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
