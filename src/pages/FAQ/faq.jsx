import { useState } from "react";

const faqs = [
  {
    question: "How do I reset my password?",
    answer: "To reset your password, go to the login page and click on 'Reset password'."
  },
  {
    question: "How do I contact support?",
    answer: "You can contact support by using the contact page."
  },
  {
    question: "How do I schedule an appointment for a test drive?",
    answer: "To schedule a test drive, please find the seller’s contact information in the car offer and get in touch to arrange a convenient time."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "4rem 1rem",
        fontFamily: "Arial, sans-serif",
        textAlign: "center"
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem", fontWeight: "bold", color: "white" }}>
        Help & FAQ
      </h1>
      <p style={{ fontSize: "1.2rem", color: "white", marginBottom: "2.5rem" }}>
        Frequently asked questions
      </p>

      <div style={{ textAlign: "left" }}>
        {faqs.map((faq, index) => {
          const isOpen = activeIndex === index;
          return (
            <div
              key={index}
              style={{
                backgroundColor: "#fff",
                width : "600px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                marginBottom: "1.5rem",
                overflow: "hidden",
                transition: "all 0.3s ease"
              }}
            >
              <div
                onClick={() => toggleFAQ(index)}
                style={{
                  padding: "1.5rem 2rem",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                   color: "black"
                }}
              >
                {faq.question}
                <span
                  style={{
                    fontSize: "1.2rem",
                    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease"
                  }}
                >
                  ▶
                </span>
              </div>
              {isOpen && (
                <div
                  style={{
                    padding: "1.25rem 2rem",
                    backgroundColor: "#f9f9f9",
                    borderTop: "1px solid #eee",
                    width: "600px",
                    fontSize: "1rem",
                    lineHeight: "1.6",
                     color: "black"
                  }}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
