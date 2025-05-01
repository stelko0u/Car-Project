import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { getFirestore, collection, addDoc } from "firebase/firestore";

export default function Contacts() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [agreement, setAgreement] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneEmptyError, setPhoneEmptyError] = useState("");
  const [phoneLengthError, setPhoneLengthError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    message: false,
  });

  const maxPhoneLength = 15;
  const db = getFirestore();

  useEffect(() => {
    const numericPhoneLength = phone.replace(/[^0-9]/g, "").length;
    const isNameValid = name.trim() !== "";
    const isEmailValid = email.trim() !== "";
    const isPhoneEmpty = phone.trim() === "";
    const isPhoneValidLength = numericPhoneLength >= 10;
    const isMessageValid = message.trim() !== "";

    setNameError(touched.name && !isNameValid ? "Please enter your name." : "");
    setEmailError(touched.email && !isEmailValid ? "Please enter your email address." : "");
    setPhoneEmptyError(touched.phone && isPhoneEmpty ? "Please enter your phone number." : "");
    setPhoneLengthError(
      touched.phone && !isPhoneEmpty && !isPhoneValidLength
        ? "A phone number must be at least 10 digits."
        : ""
    );
    setMessageError(touched.message && !isMessageValid ? "Please enter your message." : "");

    setCanSubmit(
      isNameValid &&
        isEmailValid &&
        !isPhoneEmpty &&
        isPhoneValidLength &&
        isMessageValid &&
        agreement
    );
  }, [name, email, phone, message, agreement, touched]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "phone":
        setPhone(value.replace(/[^0-9]/g, ""));
        break;
      case "message":
        setMessage(value);
        break;
      default:
        break;
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleAgreementChange = (e) => {
    setAgreement(e.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const numericPhoneLength = phone.replace(/[^0-9]/g, "").length;
    const isNameValid = name.trim() !== "";
    const isEmailValid = email.trim() !== "";
    const isPhoneEmpty = phone.trim() === "";
    const isPhoneValidLength = numericPhoneLength >= 10;
    const isMessageValid = message.trim() !== "";

    if (
      isNameValid &&
      isEmailValid &&
      !isPhoneEmpty &&
      isPhoneValidLength &&
      isMessageValid &&
      agreement
    ) {
      try {
        await addDoc(collection(db, "contacts"), {
          name,
          email,
          phone,
          message,
          agreement,
          createdAt: new Date(),
        });

        console.log("The form was sent:", { name, email, phone, message, agreement });
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        setAgreement(false);
        setTouched({ name: false, email: false, phone: false, message: false });
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    } else {
      setTouched({ name: true, email: true, phone: true, message: true });
      if (isPhoneEmpty) setPhoneEmptyError("Please enter your phone number.");
      if (!isPhoneEmpty && !isPhoneValidLength) {
        setPhoneLengthError("A phone number must be at least 10 digits.");
      }
    }
  };

  return (
    <div className="bg-[#212121] min-h-screen p-6 text-white flex justify-center items-center">
      <div className="w-full max-w-2xl flex">
        <div className="w-1/2 pr-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Get in touch with us!</h1>
          <p className="text-gray-400 mb-6 text-sm">Contact us, or send a message online</p>
          <h2 className="text-xl font-semibold mb-5 text-white">Questions and suggestions</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                Your name:
              </label>
              <input
                type="text"
                name="name"
                id="name"
                autoComplete="name"
                className={`bg-[#D9D9D9] text-black block w-full rounded-md border-0 py-2 px-3 shadow-sm focus:ring-2 focus:ring-inset focus:ring-[#146C5F] text-sm placeholder-gray-500 ${
                  nameError && "border-red-500"
                }`}
                placeholder=""
                value={name}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {nameError && <p className="text-red-500 text-xs italic">{nameError}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                Email Address:
              </label>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                className={`bg-[#D9D9D9] text-black block w-full rounded-md border-0 py-2 px-3 shadow-sm focus:ring-2 focus:ring-inset focus:ring-[#146C5F] text-sm placeholder-gray-500 ${
                  emailError && "border-red-500"
                }`}
                placeholder=""
                value={email}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {emailError && <p className="text-red-500 text-xs italic">{emailError}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">
                Phone Number:
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                autoComplete="tel"
                className={`bg-[#D9D9D9] text-black block w-full rounded-md border-0 py-2 px-3 shadow-sm focus:ring-2 focus:ring-inset focus:ring-[#146C5F] text-sm placeholder-gray-500 ${
                  (phoneEmptyError || phoneLengthError) && "border-red-500"
                }`}
                placeholder=""
                value={phone}
                onChange={handleInputChange}
                onBlur={handleBlur}
                maxLength={maxPhoneLength}
              />
              {phoneEmptyError && <p className="text-red-500 text-xs italic">{phoneEmptyError}</p>}
              {phoneLengthError && (
                <p className="text-red-500 text-xs italic">{phoneLengthError}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-white mb-1">
                Message:
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                className={`bg-[#D9D9D9] text-black block w-full rounded-md border-0 py-2 px-3 shadow-sm focus:ring-2 focus:ring-inset focus:ring-[#146C5F] text-sm placeholder-gray-500 ${
                  messageError && "border-red-500"
                }`}
                placeholder=""
                value={message}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {messageError && <p className="text-red-500 text-xs italic">{messageError}</p>}
            </div>

            <div className="flex items-center">
              <input
                id="agreement"
                name="agreement"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[#146C5F] focus:ring-[#10594F] accent-[#146C5F]"
                checked={agreement}
                onChange={handleAgreementChange}
              />
              <label htmlFor="agreement" className="ml-2 text-sm text-gray-400">
                I agree to the general terms and conditions and privacy policies.
              </label>
            </div>

            <div>
              <button
                type="submit"
                className={`flex w-full justify-center items-center rounded-md bg-[#146C5F] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#10594F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#146C5F] ${
                  !canSubmit && "opacity-50 cursor-not-allowed"
                }`}
                disabled={!canSubmit}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 transform -rotate-45"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 16.571V11a1 1 0 112 0v5.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                Send
              </button>
            </div>
          </form>
        </div>
        <div className="w-1/2 pl-8">
          <h2 className="text-xl font-semibold mb-5 text-white">Our contacts</h2>
          <p className="mb-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
            Located in: LevskiPrimorski, ul. "Studentska" 1, 9010 Varna
          </p>
          <p className="mb-2">
            <FontAwesomeIcon icon={faPhone} className="mr-2" />
            Call us: 0887089044
          </p>
          <p className="mb-2">
            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
            Email us at: AutoCarsHelp@gmail.com
          </p>
        </div>
      </div>
      {isSuccess && (
        <div className="fixed top-4 left-4 bg-green-500 text-white py-2 px-4 rounded-md shadow-md z-50">
          Your question/suggestion was sent successfully!
        </div>
      )}
    </div>
  );
}
