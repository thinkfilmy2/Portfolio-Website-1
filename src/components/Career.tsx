import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Motion Designer</h4>
                <h5>Watermarc</h5>
              </div>
              <h3>FEB 2026 - TILL NOW</h3>
            </div>
            <p>
              I handle motion graphics, SaaS motion design, and advanced AI-powered video editing. My role focuses on creating engaging visual content, simplifying complex ideas, and delivering high-quality video solutions for digital platforms.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Motion Designer</h4>
                <h5>Mediversity</h5>
              </div>
              <h3>JULY 2025 - FEB 2026</h3>
            </div>
            <p>
              Responsible for video editing, motion graphics, and color grading, specializing in crafting visually stunning and engaging videos.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Filmmaker & Video Editor</h4>
                <h5>Raasa Media</h5>
              </div>
              <h3>APRIL 2024 - JUNE 2025</h3>
            </div>
            <p>
              Crafted compelling visual narratives from concept to screen. Video editing, color grading, and sound design, motion graphics and visual effects. Delivered high-quality videos that engaged audiences.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Freelance Video Editor</h4>
                <h5>Self-Employed</h5>
              </div>
              <h3>2022 - 2024</h3>
            </div>
            <p>
              Skilled video editor, specializing in crafting visually stunning stories. Expertise includes editing, motion graphics, and color grading.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
