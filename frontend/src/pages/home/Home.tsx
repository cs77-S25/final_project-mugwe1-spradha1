import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/UserContext";
import { Loader2 } from "lucide-react";
import LoginButton from "@/components/loginButton";

export default function Home() {
	const userAuth = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (userAuth.user) {
			navigate("profile/" + userAuth.user.id);
		}
	}, [userAuth.user, navigate]);

	if (userAuth.user) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="animate-spin" size={48} />
			</div>
		);
	}


  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* First section */}
      <section className="bg-gradient-to-r from-[#A11833] to-[#3F030F] py-24">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <img
            src="https://via.placeholder.com/150"
            alt="Logo Placeholder"
            className="mx-auto mb-6"
          />
          <h1 className="text-4xl md:text-6xl font-bold leading-none text-white mb-4">
            Where Style Meets Sustainability
          </h1>
          <p className="text-base md:text-lg text-gray-200 mb-8">
            Whether you're decluttering your closet, discovering secondhand
            gems, or diving into conversations about ethical style, you're in
            the right place.
          </p>

          {/* Sign In button */}
          <div className="flex justify-center">
            {!userAuth.user && <LoginButton variant="home" />}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Your All-in-One Fashion Platform
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🛍️",
                title: "Buy & Sell",
                desc: "List items with ease or browse curated wardrobes from students just like you. Swycle makes it effortless to shop and sell sustainably.",
              },
              {
                icon: "💬",
                title: "Community Forum",
                desc: "Connect with a vibrant community of thrifters and sustainability advocates. Share tips, ask questions, showcase your fits, and stay updated on campus fashion events.",
              },
              {
                icon: "🌱",
                title: "Why Swycle?",
                desc: "Because fast fashion isn’t the future. By rethinking how we buy, sell, and talk about clothes, Swycle helps build a culture of reuse and respect. Together, we’re making fashion more affordable, expressive, and eco-conscious.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {[
              {
                q: "What is Swycle and who is it for??",
                a: "Swycle is a campus-grown platform designed for Swarthmore students who care about fashion and the planet. Whether you are looking to thrift, declutter, or connect with others passionate about sustainable style, Swycle gives you the tools to buy, sell, and chat, all in one place.",
              },
              {
                q: "How do I list an item for sale?",
                a: "It’s easy! After signing in with your Swarthmore account, go to the Store section, click “Add Item,” upload a photo, add details like price and size, and post. Your item will be visible instantly for other students to discover and purchase.",
              },
              {
                q: "Is Swycle free to use?",
                a: "Yes! Completely! Swycle is a student built platform made for peer-to-peer exchanges and open conversation. There are no fees to join, post, or buy. You don't need to worry about shipping as well. All within the community, remember?",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="border border-gray-200 rounded-lg p-4"
              >
                <summary className="font-semibold cursor-pointer">
                  {faq.q}
                </summary>
                <p className="mt-2 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#A11833] to-[#3F030F] py-8">
        <div className="container text-white font-bold mx-auto px-6 md:px-12 text-center">
          <p>© {new Date().getFullYear()} Swycle.</p>
        </div>
      </footer>
    </main>
  );
}

