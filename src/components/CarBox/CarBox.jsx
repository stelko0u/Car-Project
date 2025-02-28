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
    } else {
      setLoading(false);
    }
  }, [car.photos]);

  return (
    <Link to={`/details/${car.id}`}>
      <div className="border rounded-lg bg-white text-black w-full p-2 font-">
        {loading ? (
          <span className="h-52 w-full flex items-center justify-center">
            <span className="w-12 loading loading-spinner text-neutral"></span>
          </span>
        ) : car.photos && car.photos.length > 0 && car.photos[0] ? (
          <img
            src={car.photos[0]}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-52 object-cover rounded-lg"
          />
        ) : (
          <div className="h-52 w-full flex items-center justify-center bg-slate-100">
            <span>No image</span>
          </div>
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
      </div>
    </Link>
  );
}
