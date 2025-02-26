import React, { useState } from "react";
import Dropzone from "../../components/Header/DropZone/DropZone";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";

function CarForm() {
  const [selectedStartYear, setSelectedStartYear] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [models, setModels] = useState([]);
  const [files, setFiles] = useState([]);
  const [carInfo, setCarInfo] = useState({
    brand: "",
    model: "",
    gearbox: "",
    color: "",
  });
  const startYear = 1920;
  const endYear = 2025;

  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  const handleStartYearChange = (event) => {
    const selectedYear = parseInt(event.target.value, 10);
    setSelectedStartYear(selectedYear);
    const filteredEndYears = years.filter((year) => year >= selectedYear);
    setEndYearOptions(filteredEndYears);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarInfo({
      ...carInfo,
      [name]: value,
    });
  };

  const carData = {
    Audi: [
      "80",
      "90",
      "100",
      "А1",
      "А2",
      "A3",
      "A4",
      "A5",
      "A6",
      "A7",
      "A8",
      "Q3",
      "Q5",
      "Q7",
      "Q8",
    ],
    BMW: ["X5", "320i", "M3", "M5", "X3", "X6", "X7", "X1", "X2", "X4"],
    Mercedes: ["C-Class", "E-Class", "GLA", "GLC", "GLE", "GLS", "S-Class"],
    Volvo: ["XC90", "S60", "V40", "V70", "XC70", "S80", "V50", "V60"],
    Renault: ["Clio", "Megane", "Captur", "Kadjar", "Koleos", "Talisman"],
    Ford: ["Focus", "Fiesta", "Mondeo", "Kuga", "EcoSport", "Mustang"],
    Opel: ["Astra", "Insignia", "Corsa", "Mokka", "Grandland X", "Crossland X"],
    Fiat: ["500", "Panda", "Tipo", "500X", "500L", "Doblo"],
    Honda: ["Civic", "Accord", "CR-V", "HR-V", "Jazz", "NSX"],
    Toyota: ["Corolla", "Camry", "RAV4", "Yaris", "Land Cruiser", "Prius"],
    Nissan: ["Qashqai", "Juke", "X-Trail", "Micra", "Leaf", "GT-R"],
    "Land Rover": ["Discovery", "Defender", "Range Rover", "Freelander"],
    Suzuki: ["Swift", "Vitara", "SX4", "Jimny", "Ignis", "Baleno"],
    Hyundai: ["i30", "i20", "Tucson", "Kona", "Santa Fe", "Ioniq"],
    Bentley: ["Continental", "Bentayga", "Flying Spur"],
    Volkswagen: ["Golf", "Passat", "Tiguan", "Touareg", "Arteon", "Polo"],
    Mazda: ["CX-5", "3", "6", "CX-3", "MX-5", "CX-30"],
    Porsche: ["911", "Cayenne", "Taycan", "Panamera", "Macan", "Boxster"],
    Chevrolet: ["Malibu", "Impala", "Camaro", "Corvette", "Equinox", "Traverse"],
    Jaguar: ["XE", "XF", "F-Type", "E-Pace", "F-Pace", "I-Pace"],
    Subaru: ["Impreza", "Forester", "Outback", "XV", "BRZ", "Levorg"],
  };
  const colors = [
    "Red",
    "Green",
    "Blue",
    "Yellow",
    "Purple",
    "Orange",
    "Pink",
    "Brown",
    "Black",
    "White",
    "Silver Gray",
  ];

  const features = [
    "Air Conditioning",
    "Leather Seats",
    "Navigation System",
    "Bluetooth",
    "Rear Camera",
    "Cruise Control",
    "Heated Seats",
    "Panoramic Roof",
    "Alarm System",
    "Parking Sensors",
    "Adaptive Headlights",
    "Keyless Entry",
    "Adaptive Cruise Control",
    "Automatic Traffic Sign Recognition",
    "LED Lights",
    "Blind Spot Monitoring System",
    "Automatic Transmission",
    "Electric Seats",
    "Traction Control",
    "Stability Control (ESP)",
    "Electric Windows",
    "Electric Mirrors",
    "On-board Computer",
    "Sunroof",
    "Multifunction Steering Wheel",
    "4x4 Drive", // 4х4
    "Automatic Climate Control",
    "Tuning",
  ];

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
  };

  const handleCheckboxChange = (feature) => {
    setSelectedFeatures((prevSelectedFeatures) =>
      prevSelectedFeatures.includes(feature)
        ? prevSelectedFeatures.filter((item) => item !== feature)
        : [...prevSelectedFeatures, feature]
    );
  };

  const handleBrandChange = (event) => {
    const brand = event.target.value;
    setSelectedBrand(brand);
    setModels(carData[brand] || []);
    setCarInfo((prevInfo) => ({
      ...prevInfo,
      brand: brand,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reference to Firebase Storage
    const storage = getStorage();

    // Upload files and get URLs
    const fileUploadPromises = files.map(async (file) => {
      const fileRef = ref(storage, `cars/${file.name}`);
      await uploadBytes(fileRef, file);
      return await getDownloadURL(fileRef);
    });

    const photoURLs = await Promise.all(fileUploadPromises);

    // Create car object
    const newCar = {
      ...carInfo,
      year: selectedStartYear,
      features: selectedFeatures,
      photos: photoURLs,
    };

    try {
      // Reference to Firestore
      const db = getFirestore();
      const carsCollectionRef = collection(db, "cars");

      // Add new car data to Firestore
      await addDoc(carsCollectionRef, newCar);

      console.log("Car added to Firestore:", newCar);
    } catch (error) {
      console.error("Error adding car to Firestore:", error);
    }
  };

  return (
    <div className="p-4 bg-white">
      <div className="flex flex-col gap-4 justify-center ">
        <h1 className="text-2xl font-bold text-start text-black">Add a new car</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
          <span className="flex flex-row gap-3 w-full">
            <select
              className="select select-bordered w-32 max-w-xs bg-car-400 text-black"
              onChange={handleBrandChange}
              value={selectedBrand}
              name="brand"
            >
              <option disabled selected value="">
                Brand
              </option>
              {Object.keys(carData).map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            <select
              className="select select-bordered w-32 max-w-xs bg-car-400 text-black"
              disabled={!models.length}
              name="model"
              onChange={handleChange}
            >
              <option disabled selected value="">
                Model
              </option>
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>

            <select
              className="select select-bordered w-32 max-w-xs bg-car-400 text-black"
              onChange={handleStartYearChange}
              value={selectedStartYear}
              name="year"
            >
              <option disabled selected value="">
                Year
              </option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              className="select select-bordered w-32 max-w-xs bg-car-400 text-black"
              name="gearbox"
              onChange={handleChange}
            >
              <option disabled selected>
                Gearbox
              </option>
              <option value="automatic" key="automatic">
                Automatic
              </option>
              <option value="manual" key="manual">
                Manual
              </option>
            </select>
            <select
              className="select select-bordered w-32 max-w-xs bg-car-400 text-black"
              name="color"
              onChange={handleChange}
            >
              <option disabled selected>
                Color
              </option>
              {colors.map((color) => (
                <option key={color} value={color.toLowerCase()}>
                  {color}
                </option>
              ))}
            </select>
          </span>
          <span>
            <h2>Select car features:</h2>
            <span className="flex flex-col gap-2 justify-start" style={gridStyle}>
              {features.map((feature) => (
                <label key={feature} className="flex flex-row  align-middle">
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(feature)}
                    onChange={() => handleCheckboxChange(feature)}
                    className="checkbox checkbox-primary"
                  />
                  <label htmlFor="checkbox" className="mx-2">
                    {feature}
                  </label>
                </label>
              ))}
            </span>
          </span>
          <Dropzone
            onDrop={(acceptedFiles) => setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])}
          />
          <span className="flex justify-end">
            <input
              type="submit"
              value="Add"
              className="bg-car-500 text-white p-2 rounded-md hover:cursor-pointer px-12"
            />
          </span>
        </form>
      </div>
    </div>
  );
}

export default CarForm;
