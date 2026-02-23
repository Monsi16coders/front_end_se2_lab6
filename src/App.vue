<template>
  <div class="wellness-app">
    <div class="content-wrapper">
      <header class="hero">
        <div class="logo"></div>
        <h1>Wellness Tracker</h1>
        <p>Your mental health journey, one day at a time.</p>
      </header>

      <div class="main-layout">
        <section class="history-section">
          <h3>Recent Reflections</h3>
          <div class="history-scroll">
            <div v-if="history.length === 0" class="empty-state">No entries yet. Start tracking!</div>
            <div v-for="item in history" :key="item.id" class="mood-card">
              <div class="mood-badge" :style="{ backgroundColor: getMoodColor(item.mood_level) }">
                {{ item.mood_level }}
              </div>
              <div class="mood-info">
                <p>{{ item.journal_entry }}</p>
                <small>{{ new Date(item.created_at).toLocaleString() }}</small>
              </div>
            </div>
          </div>
        </section>

        <section class="card input-section">
          <h3>How are you today?</h3>
          <div class="mood-selector">
            <div class="emoji-display">{{ moodEmoji }}</div>
            <input v-model="newEntry.mood_level" type="range" min="1" max="10" class="slider">
            <div class="score-label">Mood Score: <strong>{{ newEntry.mood_level }}</strong> / 10</div>
          </div>
          
          <div class="input-group">
            <label>Journal Entry</label>
            <textarea v-model="newEntry.journal_entry" placeholder="What's on your mind, Charles?"></textarea>
          </div>

          <div v-if="aiMessage" class="ai-box">
            <strong>✨ AI Counselor:</strong>
            <p>{{ aiMessage }}</p>
          </div>

          <button @click="saveMood" class="btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Saving...' : 'Save Reflection' }}
          </button>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const history = ref([]);
const isSubmitting = ref(false);
const aiMessage = ref('');
const newEntry = ref({ mood_level: 5, journal_entry: '' });

// 🚀 LIVE API URL (Replacing localhost for production) [cite: 2026-02-21]
const API_URL = 'https://se2-lab6-backend.onrender.com';

const moodEmoji = computed(() => {
  const val = newEntry.value.mood_level;
  if (val <= 2) return '😫';
  if (val <= 4) return '😕';
  if (val <= 6) return '😐';
  if (val <= 8) return '🙂';
  return '🤩';
});

const fetchHistory = async () => {
  try {
    const res = await axios.get(`${API_URL}/moods`);
    history.value = res.data;
  } catch (err) { 
    console.error("Cloud API error:", err); 
  }
};

const saveMood = async () => {
  if (!newEntry.value.journal_entry) return alert("Write a note first!");
  isSubmitting.value = true;
  aiMessage.value = ''; 
  
  try {
    const response = await axios.post(`${API_URL}/moods`, {
      mood_level: parseInt(newEntry.value.mood_level),
      journal_entry: newEntry.value.journal_entry
    });
    
    aiMessage.value = response.data.ai_response;
    newEntry.value.journal_entry = '';
    await fetchHistory();
    alert("Saved successfully! ✅ Check out your AI response.");
  } catch (err) {
    alert("The Cloud API is waking up... give it 30 seconds and try again!");
  } finally { 
    isSubmitting.value = false; 
  }
};

const getMoodColor = (s) => s >= 8 ? '#6C63FF' : s >= 5 ? '#F6C84C' : '#FF6B6B';

onMounted(fetchHistory);
</script>

<style scoped>
.wellness-app { 
  background-color: #f4f7f4 !important; 
  min-height: 100vh; 
  width: 100vw; 
  display: flex; 
  justify-content: center; 
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
  color: #333; 
}

.content-wrapper { 
  width: 100%; 
  max-width: 1100px; 
  padding: 40px 20px; 
}

.hero { 
  text-align: center; 
  margin-bottom: 40px; 
}

.main-layout { 
  display: grid; 
  grid-template-columns: 1fr 1.2fr; 
  gap: 40px; 
  align-items: start; 
}

@media (max-width: 900px) {
  .main-layout { grid-template-columns: 1fr; }
}

.card { 
  background: white; 
  padding: 30px; 
  border-radius: 20px; 
  box-shadow: 0 10px 25px rgba(0,0,0,0.05); 
  text-align: center; 
  position: sticky;
  top: 20px;
}

.emoji-display { font-size: 5rem; margin-bottom: 10px; }
.slider { width: 100%; margin: 20px 0; accent-color: #27ae60; cursor: pointer; }
.input-group { text-align: left; margin-top: 20px; }

textarea { 
  width: 100%; 
  height: 120px; 
  padding: 15px; 
  border: 2px solid #eee; 
  border-radius: 12px; 
  box-sizing: border-box; 
  resize: none; 
  font-size: 1rem; 
  transition: border 0.3s;
}

textarea:focus {
  outline: none;
  border-color: #27ae60;
}

.btn-primary { 
  width: 100%; 
  padding: 15px; 
  background: #27ae60; 
  color: white; 
  border: none; 
  border-radius: 12px; 
  font-weight: bold; 
  cursor: pointer; 
  margin-top: 20px; 
  font-size: 1rem;
  transition: transform 0.2s, background 0.3s;
}

.btn-primary:hover { 
  background: #219150; 
  transform: translateY(-2px);
}

.ai-box { 
  margin: 20px 0; 
  padding: 15px; 
  background: #f1f8e9; 
  border-radius: 12px; 
  border-left: 5px solid #27ae60; 
  text-align: left; 
}

.ai-box p { margin: 5px 0 0; color: #2e7d32; font-style: italic; }

.history-section h3 { margin-top: 0; margin-bottom: 20px; }
.history-scroll { max-height: 75vh; overflow-y: auto; padding-right: 10px; }

/* Custom Scrollbar Restored 🛠️ */
.history-scroll::-webkit-scrollbar { width: 6px; }
.history-scroll::-webkit-scrollbar-track { background: #f1f1f1; }
.history-scroll::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }

.mood-card { 
  background: white; 
  margin-bottom: 15px; 
  padding: 18px; 
  border-radius: 15px; 
  display: flex; 
  align-items: center; 
  gap: 20px; 
  box-shadow: 0 4px 12px rgba(0,0,0,0.03); 
  border-left: 6px solid #27ae60;
}

.mood-badge { 
  min-width: 50px; 
  height: 50px; 
  border-radius: 50%; 
  color: white; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-weight: bold; 
  font-size: 1.2rem;
}

.mood-info p { margin: 0; font-size: 1.05rem; line-height: 1.4; }
.mood-info small { color: #999; display: block; margin-top: 5px; }

.empty-state { text-align: center; color: #aaa; margin-top: 50px; } 
  .hero .logo { font-size: 2.4rem; }

.hero h1 { margin: 0.2rem 0; font-family: 'Georgia', serif; letter-spacing: 0.4px; }

.main-layout { display: grid; grid-template-columns: 1.2fr 1fr; gap: 32px; align-items: start; }

.card { text-align: left; }

.slider { accent-color: #6C63FF; }

textarea:focus { border-color: #6C63FF; }

.btn-primary { background: #6C63FF; }
.btn-primary:hover { background: #5b52e6; }

.ai-box { background: #f3f0ff; border-left: 5px solid #6C63FF; }
.ai-box p { color: #3c2dff; }

.mood-card { border-left: 6px solid #6C63FF; }

.emoji-display { font-size: 4.6rem; }

</style>