<template>
  <div class="about-us-page">
    <h1>About Our Temple</h1>

    <section class="section-container">
      <h2>Our Story & History</h2>
      <p>Founded in [Year], our temple was established by [Founder's Name/Group] with a vision to create a spiritual sanctuary and a vibrant community hub. What began as a humble gathering place for devotees soon grew into a magnificent edifice, thanks to the unwavering dedication and generous contributions of our community members. We have overcome many challenges and celebrated countless milestones, each one strengthening our resolve to serve. [Add more specific historical details, e.g., "The land was donated by...", "First major renovation in...", "Key spiritual leader joined in..."]</p>
      <p>Through the decades, the temple has remained a beacon of peace, learning, and devotion, continually adapting to the needs of its growing congregation while preserving its ancient traditions.</p>
    </section>

    <section class="section-container">
      <h2>Our Mission & Vision</h2>
      <p><strong>Mission:</strong> To foster spiritual growth, promote universal values, and serve the community through worship, education, and compassionate outreach.</p>
      <p><strong>Vision:</strong> To be a leading spiritual institution that inspires individuals to live a life of dharma (righteousness), peace, and service, creating a harmonious and enlightened society.</p>
      <ul>
        <li>Cultivate a deep understanding of [Your Tradition/Teachings] through discourses and interactive sessions.</li>
        <li>Provide a serene environment for meditation, prayer, and self-reflection.</li>
        <li>Encourage community participation and interfaith harmony.</li>
        <li>Engage in humanitarian and charitable activities to uplift the less fortunate.</li>
      </ul>
    </section>

    <section class="section-container">
      <h2>Our Spiritual Lineage & Tradition</h2>
      <p>Our temple follows the [Specify Tradition, e.g., Vedanta, Bhakti Yoga, Theravada Buddhism, Sufism, etc.] tradition, which emphasizes [Key tenets, e.g., the oneness of existence, devotion to a personal God, mindfulness, compassion]. We draw inspiration from the teachings of [Mention key spiritual figures, e.g., Adi Shankara, Lord Buddha, Rumi, Guru Nanak Dev Ji]. Our practices are rooted in ancient scriptures such as the [e.g., Vedas, Upanishads, Bhagavad Gita, Tripitaka, Quran].</p>
      <p>We believe in the power of spiritual practice to transform lives and bring inner peace.</p>
    </section>

    <section class="section-container">
      <h2>Our Leadership & Team</h2>
      <div class="team-grid">
        <div class="team-member">
          <img :src="`${base}aboutus/aboutus.jpg`" alt="Spiritual Leader 1" class="member-photo">
          <h3>[Name of Spiritual Leader]</h3>
          <p class="role">[e.g., Head Priest, Spiritual Director]</p>
          <p>Brief bio about their background, qualifications, and role in the temple.</p>
        </div>
        <div class="team-member">
          <img :src="`${base}aboutus/aboutus1.jpg`" alt="Temple President" class="member-photo">
          <h3>[Name of Temple President]</h3>
          <p class="role">[e.g., Temple President, Board Member]</p>
          <p>Brief bio about their dedication and contribution to the temple's administration.</p>
        </div>
        </div>
    </section>

    <section class="section-container">
      <h2>What We Offer</h2>
      <p>Our temple is a vibrant hub offering a wide array of activities and services:</p>
      <ul>
        <li>Daily Arati and Pujas (Worship)</li>
        <li>Weekly Spiritual Discourses and Study Groups</li>
        <li>Meditation and Yoga Classes</li>
        <li>Celebration of all major festivals</li>
        <li>Community Kitchen (Langarkhana/Prasadam)</li>
        <li>Children's Cultural and Spiritual Education</li>
        <li>Charitable Initiatives and Food Drives</li>
      </ul>
      <router-link to="/services" class="button-link">Explore Our Services</router-link>
    </section>

    <section class="section-container testimonials-section">
      <h2>Voices from Our Community</h2>
      <div class="testimonial-grid">
        <div class="testimonial-card">
          <p>"The temple has been a source of immense peace and strength for me. The discourses are profound, and the community is so welcoming."</p>
          <p class="author">- [Name], Devotee</p>
        </div>
        <div class="testimonial-card">
          <p>"My children love the Sunday classes! They are learning so much about our culture and values in a fun environment."</p>
          <p class="author">- [Name], Parent</p>
        </div>
        </div>
    </section>
  </div>
</template>

<script>
const base = import.meta.env.BASE_URL
export default {
  name: 'AboutUsPage',
};
</script>

<style scoped>
.about-us-page {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
  text-align: left;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 40px;
}

.section-container {
  background-color: #fcfcfc;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

h2 {
  color: #ec5a73; /* A warm, inviting color */
  margin-top: 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

p {
  line-height: 1.7;
  margin-bottom: 15px;
  color: #555;
}

ul {
  list-style: disc inside;
  padding-left: 20px;
  margin-bottom: 20px;
  color: #555;
}

ul li {
  margin-bottom: 8px;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.team-member {
  text-align: center;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.member-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
  border: 3px solid #fc6389;
}

.team-member h3 {
  color: #333;
  margin-bottom: 5px;
}

.team-member .role {
  font-style: italic;
  color: #777;
  margin-bottom: 10px;
}

.button-link {
  display: inline-block;
  background-color: #f86464;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

.button-link:hover {
  background-color: #fa6464;
}

.testimonials-section {
  background-color: #f5fcf5;
  border: 1px dashed #dbe9db;
}

.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.testimonial-card {
  background-color: #fff;
  padding: 20px;
  border-left: 4px solid #f87b7b;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  font-style: italic;
}

.testimonial-card .author {
  text-align: right;
  font-style: normal;
  font-weight: bold;
  color: #666;
  margin-top: 15px;
}
</style>