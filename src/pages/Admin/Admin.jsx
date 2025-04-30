import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase';
import { Eye, Trash2 } from 'lucide-react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const AdminPage = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [carToDeleteId, setCarToDeleteId] = useState(null);
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const handleCarsClick = async () => {
        setLoading(true);
        setError(null);

        try {
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

    const openDeleteModal = (carId) => {
        setCarToDeleteId(carId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCarToDeleteId(null);
    };

    const handleDeleteCar = async () => {
        if (!carToDeleteId) return;

        try {
            closeDeleteModal();
            const carDocRef = doc(db, 'cars', carToDeleteId);
            await deleteDoc(carDocRef);
           
            handleCarsClick();
        } catch (error) {
            console.error('Error deleting car:', error);
            setError(error);
        }
    };

    useEffect(() => {
        handleCarsClick();
    }, []);

    return (
        <div className="flex h-full bg-gray-900">
            <aside className="w-64 min-h-screen bg-gray-800 text-white p-4 flex flex-col">
                <nav className="space-y-2 flex-grow">
                    <button
                        className="block w-full text-left p-2 hover:bg-gray-700 rounded"
                        onClick={handleCarsClick}
                        disabled={loading}
                    >
                        {'Cars'}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {cars.map(car => (
                            <div
                                key={car.id}
                                className="relative rounded-lg shadow-lg pb-2 cursor-pointer hover:shadow-xl transition-transform transform hover:scale-105 duration-300 bg-white text-black"
                            >
                                <Link to={`/details/${car.id}`}>
                                    <span className="flex absolute bottom-1/3 right-2 bg-primary text-white px-2 py-1 rounded-md">
                                        <p>$ {car.price ? car.price.toLocaleString() : 'N/A'}</p>
                                    </span>
                                    <img
                                        src={car.photos?.[0]}
                                        alt={car.model}
                                        className="w-full h-56 object-cover rounded-md"
                                    />
                                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom_left,rgba(30,30,30,1)_0%,rgba(30,30,30,0)_15%,rgba(30,30,30,0)_100%)]"></div>

                                    {car.views !== undefined && (
                                        <span className="flex absolute top-2 right-2 text-white gap-1">
                                            <Eye /> {car.views.toLocaleString()}
                                        </span>
                                    )}

                                    <span className="px-4 flex flex-col">
                                        <h3 className="text-lg font-bold mt-2">
                                            {car.brand} {car.model}
                                        </h3>
                                        <p>Year: {car.year || 'N/A'}</p>
                                        <p>Engine: {car.fuelType || 'N/A'}</p>
                                        <p>Odometer: {car.odometer ? car.odometer.toLocaleString() + ' km' : 'N/A'}</p>
                                        <p>Gearbox: {car.gearbox ? car.gearbox.charAt(0).toUpperCase() + car.gearbox.slice(1) : 'N/A'}</p>
                                        <p>Color: {car.color || 'N/A'}</p>
                                        <p>Displacement: {car.displacement || 'N/A'}</p>
                                    </span>
                                </Link>
                                <button
                                    onClick={() => openDeleteModal(car.id)}
                                    className="absolute bottom-2 right-2 bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Modal
                isOpen={isDeleteModalOpen}
                onRequestClose={closeDeleteModal}
                contentLabel="Delete Car Confirmation"
                className="rounded-lg shadow-lg max-w-md w-full mx-auto my-auto bg-white p-6"
                overlayClassName="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
            >
                <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this car?</h2>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={closeDeleteModal}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeleteCar}
                        className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-md"
                    >
                        Delete
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminPage;