import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export default function Details() {
  const { id: carId } = useParams();
  const [car, setCar] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const db = getFirestore();
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const carDocRef = doc(db, "cars", carId);
        const carSnapshot = await getDoc(carDocRef);

        if (carSnapshot.exists()) {
          const carData = carSnapshot.data();
          setCar(carData);

          onAuthStateChanged(auth, (user) => {
            if (user && user.email === carData.owner) {
              setIsOwner(true);
            }
          });
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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
          <Carousel
            showArrows={true}
            showThumbs={false}
            dynamicHeight={false}
            autoPlay={false}
            infiniteLoop={true}
            className="max-w-2xl max-h-96"
            onClickItem={openModal}
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
          <span className="lg:w-1/2 text-slate-600 flex lg:flex-row flex-col ">
            <span>
              <h1 className="text-2xl font-bold ">
                {car.brand} {car.model}
              </h1>
              <p>Year: {car.year}</p>
              <p>Power: {car.power} HP</p>
              <p>Price: ${car.price}</p>
              <p>Phone number: {car.phone}</p>
              <p>Owner: {car.owner}</p>
              <p>Features: {car.features.join(", ")}</p>
            </span>
            <span>
              {isOwner && (
                <div className="flex gap-2 mt-4 lg:flex-row flex-col w-full">
                  <button className="btn btn-primary lg:w-auto flex " onClick={handleEdit}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={handleDelete}>
                    Delete
                  </button>
                </div>
              )}
            </span>
          </span>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 "
          onClick={closeModal}
        >
          <div
            className=" p-4 rounded-lg max-w-2xl w-full max-h-[90%] flex justify-center items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Carousel
              showArrows={true}
              showThumbs={false}
              dynamicHeight={false}
              autoPlay={false}
              infiniteLoop={true}
              onClick={closeModal}
              className="w-full "
            >
              {car.photos.map((photoUrl, index) => (
                <div key={index} className="flex h-full items-center">
                  <img
                    src={photoUrl}
                    alt={`Large car photo ${index + 1}`}
                    className="object-contain max-h-[80vh]"
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
}
