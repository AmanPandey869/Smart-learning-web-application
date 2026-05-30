const About = () => {
  return (
    <div className="page-container space-y-8">
      
      {/* Heading */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          About <span className="gradient-text">FGIET</span>
        </h1>
        <p className="text-gray-400 mt-2">
          Feroze Gandhi Institute of Engineering and Technology
        </p>
      </div>

      {/* Section 1 */}
      <div className="bg-gray-900 p-6 rounded-xl">
        <h2 className="text-xl text-white font-semibold mb-2">
          Our Institution
        </h2>
        <p className="text-gray-300 leading-relaxed">
          Feroze Gandhi Institute of Engineering and Technology (FGIET), Raebareli 
          is a premier technical institution dedicated to providing quality education 
          in engineering and technology. The institute focuses on academic excellence, 
          innovation, and overall development of students.
        </p>
      </div>

      {/* Section 2 */}
      <div className="bg-gray-900 p-6 rounded-xl">
        <h2 className="text-xl text-white font-semibold mb-2">
          Our Mission
        </h2>
        <p className="text-gray-300">
          To develop skilled engineers and professionals by providing high-quality 
          technical education, fostering innovation, and promoting ethical values 
          in students.
        </p>
      </div>

      {/* Section 3 */}
      <div className="bg-gray-900 p-6 rounded-xl">
        <h2 className="text-xl text-white font-semibold mb-2">
          Our Vision
        </h2>
        <p className="text-gray-300">
          To become a center of excellence in technical education and research, 
          producing competent professionals capable of contributing to society 
          and industry.
        </p>
      </div>

      {/* Section 4 */}
      <div className="bg-gray-900 p-6 rounded-xl">
        <h2 className="text-xl text-white font-semibold mb-2">
          About This Platform
        </h2>
        <p className="text-gray-300">
          This Smart Learning Management System is developed to enhance digital 
          learning for students of FGIET. It provides structured courses, quizzes, 
          faculty interaction, and performance tracking to support modern education.
        </p>
      </div>

    </div>
  );
};

export default About;