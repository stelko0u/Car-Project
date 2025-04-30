import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from '../../firebase';

const AdminPage = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleCarsClick = async () => {
        setLoading(true);
        setError(null);

        try {
            const app = initializeApp(firebaseConfig);
            const db = getFirestore(app);

            const carsCollection = collection(db, 'cars');
            const carsSnapshot = await getDocs(carsCollection);
            const carsData = carsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCars(carsData);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    return (
        <div className="flex h-full bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 min-h-screen bg-gray-800 text-white p-4 flex flex-col">
                <nav className="space-y-2 flex-grow">
                    <button
                        className="block w-full text-left p-2 hover:bg-gray-700 rounded"
                        onClick={handleCarsClick}
                        disabled={loading}
                    >
                        {loading ? 'Loading Cars...' : 'Cars'}
                    </button>
                    <button className="block w-full text-left p-2 hover:bg-gray-700 rounded">Users</button>
                    <button className="block w-full text-left p-2 hover:bg-gray-700 rounded">Messages</button>
                </nav>
                <Link to="/profile" className="block w-full text-left p-2 hover:bg-gray-700 rounded mt-auto">
                    Exit
                </Link>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                <h1 className="text-3xl font-bold mb-4 text-white">Welcome to Admin Panel</h1>
                {loading && <div className="text-white">Loading cars...</div>}
                {error && <div className="text-red-500">Error: {error.message}</div>}
                {cars.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cars.map(car => (
                            <div
                                key={car.id}
                                className="rounded-lg shadow-lg pb-2 cursor-pointer hover:shadow-xl transition-transform transform hover:scale-105 duration-300 bg-white text-black"
                                onClick={() => navigate(`/details/${car.id}`)}
                            >
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold  mb-2">{car.brand}</h2>
                                    <div className="text-gray-600">
                                        <p className="mb-1"><span className="font-medium ">Color:</span> {car.color}</p>
                                        <p className="mb-1"><span className="font-medium ">Displacement:</span> {car.displacement}</p>
                                        <p className="mb-1"><span className="font-medium ">Fuel Type:</span> {car.fuelType}</p>
                                        <p><span className="font-medium ">Gearbox:</span> {car.gearbox}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminPage;
