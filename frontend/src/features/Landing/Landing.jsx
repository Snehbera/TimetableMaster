import React, { useState } from "react";
import { Link } from "react-router";

// It's a good practice to have icons as their own components
const SparklesIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
    <path d="M20 2v4"></path>
    <path d="M22 4h-4"></path>
    <circle cx="4" cy="20" r="2"></circle>
  </svg>
);

const ArrowRightIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
);

const CalendarIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M8 2v4"></path>
    <path d="M16 2v4"></path>
    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
    <path d="M3 10h18"></path>
  </svg>
);

const CircleCheckIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
);

const ClockIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 6v6l4 2"></path>
    <circle cx="12" cy="12" r="10"></circle>
  </svg>
);

const UsersIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <circle cx="9" cy="7" r="4"></circle>
  </svg>
);

const ZapIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
  </svg>
);

const ChartColumnIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
    <path d="M18 17V9"></path>
    <path d="M13 17V5"></path>
    <path d="M8 17v-3"></path>
  </svg>
);

const ShieldIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
  </svg>
);

const QuoteIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
    <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
  </svg>
);

const StarIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
  </svg>
);

const ChevronDownIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m6 9 6 6 6-6"></path>
  </svg>
);

const PhoneIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
  </svg>
);

const MailIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
  </svg>
);

const MapPinIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const SendIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
    <path d="m21.854 2.147-10.94 10.939"></path>
  </svg>
);

const FacebookIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TwitterIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const LinkedinIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect width="4" height="12" x="2" y="9"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const InstagramIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
      <h3 className="flex">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="flex flex-1 items-center justify-between gap-4 px-6 py-4 text-sm font-medium transition-all text-left text-gray-900"
        >
          {question}
          <ChevronDownIcon
            className={`size-4 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </h3>
      <div
        className={`overflow-hidden text-sm transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-6 pb-4 text-gray-600">{answer}</div>
      </div>
    </div>
  );
};

export default function App() {
  const faqs = [
    {
      question: "How does the AI timetable generator work?",
      answer:
        "Our AI uses advanced algorithms to analyze your constraints (teacher availability, room capacity, subject requirements) and generates an optimized, conflict-free schedule in seconds.",
    },
    {
      question: "Can I customize the timetable after generation?",
      answer:
        "Yes, absolutely! You have full control to manually adjust the generated timetable. Simply drag and drop classes to make any necessary changes.",
    },
    {
      question: "What file formats do you support for import and export?",
      answer:
        "You can import data from CSV and Excel files. Timetables can be exported to PDF, Excel, and can be integrated with Google Calendar and other calendar applications.",
    },
    {
      question: "Is there a limit to the number of classes or teachers?",
      answer:
        "Our platform is designed to scale. Different subscription plans have different limits, but our enterprise plan supports an unlimited number of classes, teachers, and rooms to suit large institutions.",
    },
    {
      question: "How secure is my data?",
      answer:
        "We take data security very seriously. All data is encrypted in transit and at rest. We use enterprise-grade security measures and perform regular backups to ensure your data is always safe and accessible.",
    },
    {
      question: "Can multiple users collaborate on the same timetable?",
      answer:
        "Yes, our platform supports real-time multi-user collaboration. You can invite team members, assign roles, and work together on the same schedule simultaneously.",
    },
    {
      question: "Do you offer customer support?",
      answer:
        "We offer comprehensive customer support through email, live chat, and phone. Our support team is available to help you with any questions or issues you may have.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes, we offer a 14-day free trial with full access to all features. No credit card is required to get started.",
    },
  ];

  const ctaBgStyle = {
    backgroundImage:
      "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')",
  };

  return (
    <div className="font-sans">
      <div className="bg-gradient-to-br from-purple-600 to-indigo-800">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <SparklesIcon
                  className="w-6 h-6 text-purple-600"
                  aria-hidden="true"
                />
              </div>
              <span className="text-white text-xl font-bold">TimeTablePro</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-white/90 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-white/90 hover:text-white transition-colors"
              >
                How it Works
              </a>
              <a
                href="#testimonials"
                className="text-white/90 hover:text-white transition-colors"
              >
                Testimonials
              </a>
              <a
                href="#faq"
                className="text-white/90 hover:text-white transition-colors"
              >
                FAQ
              </a>
              <Link
                to="/login"
                className="text-white/90 hover:text-white transition-colors"
              >
                Login
              </Link>
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 bg-white text-purple-600 hover:bg-white/90">
                Get Started
              </button>
            </div>
          </nav>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <SparklesIcon className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm">Smart Scheduling Made Simple</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl text-white font-bold tracking-tight">
                Effortless Timetables in Minutes
              </h1>
              <p className="text-xl text-white/90 max-w-xl">
                Create perfect schedules for schools, colleges, and
                organizations. Our AI-powered generator eliminates conflicts and
                saves you hours of manual work.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-10 rounded-md px-6 bg-white text-purple-600 hover:bg-white/90 group">
                  Start Free Trial
                  <ArrowRightIcon
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </button>
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 h-10 rounded-md px-6 border-2 border-white text-white hover:bg-white hover:text-purple-600 transition-all">
                  Watch Demo
                </button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold">10,000+</div>
                  <div className="text-white/80 text-sm">Active Users</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div>
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-white/80 text-sm">Institutions</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div>
                  <div className="text-3xl font-bold">4.9/5</div>
                  <div className="text-white/80 text-sm">Rating</div>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <CalendarIcon
                        className="w-6 h-6 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-semibold">
                        Weekly Schedule
                      </h3>
                      <p className="text-sm text-gray-500">Computer Science</p>
                    </div>
                  </div>
                  <CircleCheckIcon
                    className="w-6 h-6 text-green-500"
                    aria-hidden="true"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="w-2 h-12 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium">
                        Data Structures
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <ClockIcon
                          className="w-3 h-3 text-gray-500"
                          aria-hidden="true"
                        />
                        <p className="text-xs text-gray-500">
                          9:00 AM - 10:30 AM
                        </p>
                      </div>
                    </div>
                    <div className="text-xs bg-white px-2 py-1 rounded font-semibold text-blue-600">
                      MON
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <div className="w-2 h-12 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium">
                        Algorithms
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <ClockIcon
                          className="w-3 h-3 text-gray-500"
                          aria-hidden="true"
                        />
                        <p className="text-xs text-gray-500">
                          11:00 AM - 12:30 PM
                        </p>
                      </div>
                    </div>
                    <div className="text-xs bg-white px-2 py-1 rounded font-semibold text-purple-600">
                      TUE
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg border border-pink-200">
                    <div className="w-2 h-12 bg-pink-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium">
                        Database Systems
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <ClockIcon
                          className="w-3 h-3 text-gray-500"
                          aria-hidden="true"
                        />
                        <p className="text-xs text-gray-500">
                          2:00 PM - 3:30 PM
                        </p>
                      </div>
                    </div>
                    <div className="text-xs bg-white px-2 py-1 rounded font-semibold text-pink-600">
                      WED
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 z-0 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-4 border border-white/20 transform rotate-3">
                <div className="flex items-center gap-2 mb-2">
                  <UsersIcon
                    className="w-5 h-5 text-purple-600"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-gray-900 font-medium">
                    Class: 30 Students
                  </p>
                </div>
                <div className="w-24 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-4 border border-white/20 transform -rotate-3">
                <div className="flex items-center gap-2">
                  <CircleCheckIcon
                    className="w-5 h-5 text-green-500"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-gray-900 font-medium">
                    No Conflicts
                  </p>
                </div>
              </div>
              <div className="absolute -top-8 left-1/2 w-20 h-20 bg-yellow-400/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-8 right-1/4 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
      <section
        id="features"
        className="py-24 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block bg-purple-100 text-purple-600 px-4 py-2 rounded-full mb-4 text-sm font-semibold">
              Why Choose Us
            </div>
            <h2 className="text-4xl md:text-5xl text-gray-900 font-bold mb-6 tracking-tight">
              Everything You Need for Perfect Schedules
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features designed to make timetable creation effortless
              and efficient
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col gap-2 rounded-xl border p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-gray-200 bg-white">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4">
                <ZapIcon className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                AI-Powered Generation
              </h3>
              <p className="text-gray-600">
                Our intelligent algorithm creates optimal schedules in seconds,
                considering all constraints and preferences.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl border p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-gray-200 bg-white">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center mb-4">
                <CalendarIcon
                  className="w-7 h-7 text-white"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Conflict-Free Scheduling
              </h3>
              <p className="text-gray-600">
                Automatically detects and resolves scheduling conflicts,
                ensuring smooth operations every time.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl border p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-gray-200 bg-white">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mb-4">
                <UsersIcon className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Multi-User Collaboration
              </h3>
              <p className="text-gray-600">
                Work together with your team in real-time. Share, edit, and
                manage schedules collaboratively.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl border p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-gray-200 bg-white">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-4">
                <ChartColumnIcon
                  className="w-7 h-7 text-white"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Advanced Analytics
              </h3>
              <p className="text-gray-600">
                Get insights into resource utilization, teacher workload, and
                schedule optimization opportunities.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl border p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-gray-200 bg-white">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center mb-4">
                <ClockIcon className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Time-Saving Automation
              </h3>
              <p className="text-gray-600">
                Reduce hours of manual work to just minutes. Focus on what
                matters while we handle the complexity.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl border p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-gray-200 bg-white">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center mb-4">
                <ShieldIcon className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Secure & Reliable
              </h3>
              <p className="text-gray-600">
                Enterprise-grade security with automatic backups. Your data is
                always safe and accessible.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section
        id="testimonials"
        className="py-24 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block bg-green-100 text-green-600 px-4 py-2 rounded-full mb-4 text-sm font-semibold">
              What Our Users Say
            </div>
            <h2 className="text-4xl md:text-5xl text-gray-900 font-bold mb-6 tracking-tight">
              Trusted by Educators Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied institutions using TimeTablePro
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col rounded-xl border p-8 bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <QuoteIcon
                className="w-10 h-10 text-purple-200 mb-4"
                aria-hidden="true"
              />
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-6 flex-grow">
                "TimeTablePro has transformed our scheduling process. What used
                to take us days now takes just minutes. The conflict detection
                is incredible!"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1551989745-347c28b620e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHRlYWNoZXJ8ZW58MXx8fHwxNzU5ODQyNDMxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Sarah Johnson"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="text-gray-900 font-semibold">
                    Sarah Johnson
                  </div>
                  <div className="text-sm text-gray-500">
                    Principal, Riverside High School
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col rounded-xl border p-8 bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <QuoteIcon
                className="w-10 h-10 text-purple-200 mb-4"
                aria-hidden="true"
              />
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-6 flex-grow">
                "The AI-powered generation is a game-changer. It handles complex
                constraints effortlessly and the analytics help us optimize
                resource allocation."
              </p>
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1758518727984-17b37f2f0562?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBidXNpbmVzc3xlbnwxfHx8fDE3NTk3Njc0NzN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Michael Chen"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="text-gray-900 font-semibold">
                    Michael Chen
                  </div>
                  <div className="text-sm text-gray-500">
                    Academic Coordinator, Tech University
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col rounded-xl border p-8 bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <QuoteIcon
                className="w-10 h-10 text-purple-200 mb-4"
                aria-hidden="true"
              />
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-6 flex-grow">
                "Absolutely fantastic! The collaborative features make it easy
                to work with multiple departments. Customer support is excellent
                too."
              </p>
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1581065178026-390bc4e78dad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTc1ODkyMnww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Emily Rodriguez"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="text-gray-900 font-semibold">
                    Emily Rodriguez
                  </div>
                  <div className="text-sm text-gray-500">
                    Department Head, Lincoln College
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full mb-4 text-sm font-semibold">
              FAQ
            </div>
            <h2 className="text-4xl md:text-5xl text-gray-900 font-bold mb-6 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about TimeTablePro
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </section>
      <section id="contact" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block bg-purple-100 text-purple-600 px-4 py-2 rounded-full mb-4 text-sm font-semibold">
              Get In Touch
            </div>
            <h2 className="text-4xl md:text-5xl text-gray-900 font-bold mb-6 tracking-tight">
              Have Questions? Let's Talk
            </h2>
            <p className="text-xl text-gray-600">
              We'd love to hear from you. Send us a message and we'll respond as
              soon as possible.
            </p>
          </div>
          <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 rounded-3xl p-8 text-white">
                <h3 className="text-2xl text-white font-bold mb-4">
                  Contact Information
                </h3>
                <p className="text-white/90 mb-8">
                  Fill out the form and our team will get back to you within 24
                  hours.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                      <PhoneIcon
                        className="w-5 h-5 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm mb-1">Phone</p>
                      <a
                        href="tel:+1234567890"
                        className="text-white hover:underline"
                      >
                        +1 (234) 567-890
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                      <MailIcon
                        className="w-5 h-5 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm mb-1">Email</p>
                      <a
                        href="mailto:support@timetablepro.com"
                        className="text-white hover:underline"
                      >
                        support@timetablepro.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPinIcon
                        className="w-5 h-5 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm mb-1">Location</p>
                      <p className="text-white">
                        123 Business Street,
                        <br />
                        New York, NY 10001
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-12 relative">
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-8 right-8 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-gray-700 font-medium"
                      >
                        Your Name
                      </label>
                      <input
                        className="flex w-full min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 h-12"
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-gray-700 font-medium"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="flex w-full min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 h-12"
                        id="email"
                        name="email"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="text-gray-700 font-medium"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="flex w-full min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 h-12"
                      id="phone"
                      name="phone"
                      placeholder="+1 (234) 567-890"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-gray-700 font-medium"
                    >
                      Your Message
                    </label>
                    <textarea
                      className="flex min-h-16 w-full rounded-md border px-3 py-2 text-base transition-[color,box-shadow] outline-none bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 resize-none"
                      id="message"
                      name="message"
                      placeholder="Tell us about your project or ask us anything..."
                      rows="6"
                      required
                    ></textarea>
                  </div>
                  <button
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all rounded-md px-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 group"
                    type="submit"
                  >
                    Send Message
                    <SendIcon
                      className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                      aria-hidden="true"
                    />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={ctaBgStyle}></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-6 tracking-tight">
            Ready to Transform Your Scheduling?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of institutions already saving time and reducing
            stress with TimeTablePro
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center gap-2 text-white">
              <CircleCheckIcon className="w-5 h-5" aria-hidden="true" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <CircleCheckIcon className="w-5 h-5" aria-hidden="true" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <CircleCheckIcon className="w-5 h-5" aria-hidden="true" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <CircleCheckIcon className="w-5 h-5" aria-hidden="true" />
              <span>Full feature access</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all h-10 rounded-md px-6 bg-white text-purple-600 hover:bg-white/90 group">
              Start Your Free Trial
              <ArrowRightIcon
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </button>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all h-10 rounded-md px-6 border border-white text-white hover:bg-white/10">
              Schedule a Demo
            </button>
          </div>
          <p className="text-white/80 mt-6 text-sm">
            Join 10,000+ happy users • No credit card required
          </p>
        </div>
      </section>
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
            <div className="col-span-2 md:col-span-3 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                  <SparklesIcon
                    className="w-6 h-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <span className="text-white text-xl font-bold">
                  TimeTablePro
                </span>
              </div>
              <p className="text-gray-400 mb-6 max-w-sm">
                The ultimate AI-powered timetable generator for schools,
                colleges, and organizations. Create perfect schedules in
                minutes.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors"
                >
                  <FacebookIcon className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  aria-label="Twitter"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors"
                >
                  <TwitterIcon className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    How it Works
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="hover:text-white transition-colors"
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Press Kit
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Video Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    GDPR
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2025 TimeTablePro. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <a href="#" className="hover:text-white transition-colors">
                  Status
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Changelog
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Sitemap
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
