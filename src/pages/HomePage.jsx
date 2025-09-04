import React from "react";

export default function Home() {
  return (
    <div className="bg-background-light dark:bg-background-dark">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-light to-purple-light text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Welcome to Sanskriti Pre-School
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl opacity-90">
            Where young minds bloom and learning is joyful 🌱.  
            We believe every child is unique and deserves an environment that 
            nurtures curiosity, creativity and confidence.  
            At Sanskriti Pre-School, learning is a journey filled with discovery, 
            play and purposeful experiences that build strong foundations for life.  
            We aim to create a warm, welcoming atmosphere where parents and teachers 
            work together to help every child grow.
          </p>
          <a
            href="#about"
            className="mt-6 inline-block bg-secondary-light hover:bg-secondary-dark text-black px-6 py-3 rounded-full font-semibold shadow-lg transition-transform hover:scale-105"
          >
            Know More
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <img
            src="/schoolBulding.webp"
            alt="Sanskriti Pre School"
            className="rounded-2xl shadow-lg object-cover w-full h-80"
          />
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primaryLight dark:text-text-primaryDark mb-4">
              About Our School
            </h2>
            <p className="text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed mb-4">
              Sanskriti Pre-School is a nurturing environment focused on holistic
              development. We combine innovative teaching, interactive
              classrooms, and creative activities to build curiosity and
              confidence in children.  
              Our classrooms are bright and stimulating, our curriculum is 
              play-based and activity-oriented, and our teachers are trained to 
              support emotional as well as intellectual growth.  
              We encourage exploration, problem-solving, storytelling, music and art 
              to help children discover their interests and talents.  
              Parents are kept actively involved through regular updates and 
              interactive sessions.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-light mt-1">✔</span>
                <span>Play-based and activity-oriented curriculum</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-light mt-1">✔</span>
                <span>Highly qualified & caring staff</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-light mt-1">✔</span>
                <span>Safe & colourful infrastructure</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Principal Section */}
      <section className="py-16 bg-surfaceAlt-light dark:bg-surfaceAlt-dark">
        <div className="container mx-auto px-4 text-center">
          <img
            src="/principal.jpg"
            alt="Principal"
            className="mx-auto w-40 h-40 rounded-full object-cover ring-4 ring-secondary-light shadow-xl mb-6"
          />
          <h3 className="text-xl md:text-2xl font-semibold text-text-primaryLight dark:text-text-primaryDark">
            Message from our Principal
          </h3>
          <p className="max-w-2xl mx-auto mt-4 text-text-secondaryLight dark:text-text-secondaryDark">
            “Our goal is to make the first step of formal learning inspiring and
            full of wonder.  
            We ensure every child feels cared for, safe, and encouraged to explore.  
            The preschool years are the foundation of a lifetime of learning, 
            and we are committed to creating a joyful, secure and stimulating 
            environment.  
            We partner with parents as co-educators, valuing their insights and 
            contributions.  
            Together, we help children grow into confident, compassionate and 
            responsible young learners.”
          </p>
        </div>
      </section>

      {/* Staff Grid */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-text-primaryLight dark:text-text-primaryDark mb-10">
          Meet Our Caring Staff
        </h2>
        <p className="text-center max-w-3xl mx-auto mb-10 text-text-secondaryLight dark:text-text-secondaryDark">
          Our teachers are the heart of Sanskriti Pre-School.  
          Each educator brings expertise, patience and creativity to the classroom.  
          They are trained in child development, early literacy, numeracy, 
          art integration and positive discipline.  
          Beyond academics, they help children develop social skills, empathy 
          and independence.  
          Parents can approach them easily for feedback and suggestions.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-transform"
            >
              <img
                src="/staff.webp"
                alt={`Staff ${i}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="font-semibold text-text-primaryLight dark:text-text-primaryDark">
                  Teacher Name {i}
                </h4>
                <p className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">
                  Pre-Primary Educator
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Activities / Benefits */}
      <section className="py-16 bg-gradient-to-r from-pink-light to-orange-400 text-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Why Choose Sanskriti Pre-School?
            </h2>
            <ul className="space-y-3 text-lg">
              <li>🎨 Creative learning spaces with hands-on activities</li>
              <li>📚 Early literacy & numeracy focus through play</li>
              <li>🌳 Outdoor play & nature learning everyday</li>
              <li>🤝 Regular parent-teacher interaction & workshops</li>
              <li>🎶 Music, movement and storytelling integrated into daily routine</li>
              <li>🧩 Individual attention to support every child’s pace</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center bg-surface-light dark:bg-surface-dark">
        <h2 className="text-2xl md:text-3xl font-bold text-text-primaryLight dark:text-text-primaryDark mb-4">
          Enroll Your Child Today!
        </h2>
        <p className="text-text-secondaryLight dark:text-text-secondaryDark max-w-xl mx-auto mb-6">
          Admissions are open for the upcoming academic year.  
          We welcome you to visit our campus, interact with our staff and 
          experience our classrooms in action.  
          Book a school tour, ask your questions and see how we can support your 
          child’s first steps in education.  
          Together, we can give your child the joyful start they deserve.
        </p>
        <a
          href="/contact"
          className="inline-block bg-gradient-to-r from-green-light to-emerald-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          Get in Touch
        </a>
      </section>
    </div>
  );
}
