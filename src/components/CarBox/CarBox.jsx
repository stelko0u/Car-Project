import { CalendarDays, DollarSign, PaintBucket } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Engine from "../../icons/engine";
import Calendar from "../../icons/Calendar";
import Cube from "../../icons/Cube";

export default function CarBox({ car }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (car.photos && car.photos[0]) {
      const img = new Image();
      img.src = car.photos[0];
      img.onload = () => setLoading(false);
    }
  }, [car.photos]);

  return (
    <div className="border rounded-lg bg-white text-black w-full p-2 font-">
      {loading ? (
        <span className="h-52 w-full flex items-center justify-center">
          <span className="w-12 loading loading-spinner text-neutral"></span>
        </span>
      ) : (
        car.photos &&
        car.photos[0] && (
          <img
            src={car.photos[0]}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-52 object-cover rounded-lg"
          />
        )
      )}
      <h2 className="text-2xl font-semibold">
        {car.brand} {car.model}
      </h2>

      <span className="flex items-center gap-1 text-lg">
        <Engine />
        <p>{car.power} HP</p>
      </span>
      <span className="flex items-center gap-1 text-lg">
        <Cube />
        <p>
          {car.displacement} cm<sup>3</sup>
        </p>
      </span>
      <span className="flex items-center gap-1 text-lg">
        <Calendar />
        <p>{car.year}</p>
      </span>

      {/* <p className="flex ">
        <CalendarDays /> {car.year}
      </p>
      <p className="flex ">
        <PaintBucket /> {car.color}
      </p>
      <p className="flex ">${car.price}</p> */}
      <Link
        to={`/details/${car.id}`}
        className="bg-car-500 p-1 w-full flex text-center justify-center mt-3 
        rounded-md hover:bg-car-700 hover:text-white hover:transition-all duration-300 
        hover:shadow-custom-black"
      >
        Details
      </Link>
    </div>
  );
}
