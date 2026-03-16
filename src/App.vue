<template>
  <div class="wellness-app">
    <div class="content-wrapper">
      <header class="hero">
        <div class="hero-row">
          <div class="logo">🌿</div>
          <div>
            <h1>Monsi Wellness</h1>
            <p class="muted">Small daily reflections — simple progress.</p>
          </div>
        </div>
        <div class="hero-actions">
          <div class="chip">👤 Monsi</div>
        </div>
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
            <textarea v-model="newEntry.journal_entry" placeholder="Write something for today, Monsi..."></textarea>
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
  console.log("fetchHistory: requesting history from", `${API_URL}/moods`);
  try {
    const res = await axios.get(`${API_URL}/moods`);
    console.log("fetchHistory: response status", res.status);
    history.value = res.data;
  } catch (err) {
    console.error("fetchHistory: Cloud API error:", err);
  }
};

const saveMood = async () => {
  console.log("saveMood: submit clicked", newEntry.value);
  // Intentional bug for lab exercise (uncomment to reproduce):
  // console.log("User mood value:", moodValue); // ReferenceError: moodValue is not defined

  if (!newEntry.value.journal_entry) return alert("Write a note first!");
  isSubmitting.value = true;
  aiMessage.value = '';

  try {
    const payload = {
      mood_level: parseInt(newEntry.value.mood_level),
      journal_entry: newEntry.value.journal_entry
    };
    console.log("saveMood: sending payload", payload);
    const response = await axios.post(`${API_URL}/moods`, payload);
    console.log("saveMood: API response status", response.status, response.data);

    aiMessage.value = response.data.ai_response;
    newEntry.value.journal_entry = '';
    await fetchHistory();
    alert("Saved successfully! ✅ Check out your AI response.");
  } catch (err) {
    console.error("saveMood: API error", err);
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
  min-height: 100vh; 
  width: 100vw; 
  display: flex; 
  justify-content: center; 
  color: var(--text-dark);
}

.content-wrapper { 
  width: 100%; 
  max-width: 1100px; 
  padding: 36px 20px; 
}

.hero { 
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
}

.hero-row { display:flex; gap:12px; align-items:center; }
.hero .muted { color: var(--muted); margin:0; }
.hero-actions { display:flex; align-items:center; gap:12px; }

.main-layout { 
  display: grid; 
  grid-template-columns: 1fr 1.1fr; 
  gap: 28px; 
  align-items: start; 
}

@media (max-width: 900px) {
  .main-layout { grid-template-columns: 1fr; }
}

.card { 
  background: var(--card-white); 
  padding: 26px; 
  border-radius: 16px; 
  box-shadow: 0 8px 20px rgba(16,42,67,0.06); 
  text-align: left; 
  position: sticky;
  top: 20px;
}

.emoji-display { font-size: 4.6rem; margin-bottom: 6px; }
.slider { width: 100%; margin: 18px 0; accent-color: var(--primary); cursor: pointer; }
.input-group { text-align: left; margin-top: 20px; }

textarea { 
  width: 100%; 
  height: 120px; 
  padding: 15px; 
  border: 2px solid rgba(0,0,0,0.06); 
  border-radius: 12px; 
  box-sizing: border-box; 
  resize: none; 
  font-size: 1rem; 
  transition: border 0.3s, box-shadow 0.2s;
}

textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 6px 18px rgba(108,99,255,0.06);
}

.btn-primary { 
  width: 100%; 
  padding: 12px 18px; 
  background: linear-gradient(90deg, var(--primary), var(--accent)); 
  color: white; 
  border: none; 
  border-radius: 999px; 
  font-weight: 700; 
  cursor: pointer; 
  margin-top: 18px; 
  font-size: 0.98rem;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 6px 18px rgba(108,99,255,0.12);
}

.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(108,99,255,0.14); }

.ai-box { 
  margin: 18px 0; 
  padding: 14px; 
  background: rgba(108,99,255,0.06); 
  border-radius: 10px; 
  border-left: 4px solid var(--primary); 
  text-align: left; 
}

.ai-box p { margin: 6px 0 0; color: rgba(15,23,36,0.7); font-style: italic; }

.history-section h3 { margin-top: 0; margin-bottom: 18px; }
.history-scroll { max-height: 72vh; overflow-y: auto; padding-right: 10px; }

/* Custom Scrollbar Restored 🛠️ */
.history-scroll::-webkit-scrollbar { width: 6px; }
.history-scroll::-webkit-scrollbar-track { background: #f1f1f1; }
.history-scroll::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }

.mood-card { 
  background: var(--card-white); 
  margin-bottom: 14px; 
  padding: 16px; 
  border-radius: 12px; 
  display: flex; 
  align-items: center; 
  gap: 16px; 
  box-shadow: 0 6px 18px rgba(16,42,67,0.04); 
  border-left: 6px solid var(--primary);
}

.mood-badge { 
  min-width: 48px; 
  height: 48px; 
  border-radius: 50%; 
  color: white; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-weight: 700; 
  font-size: 1.05rem;
}

.mood-info p { margin: 0; font-size: 1.05rem; line-height: 1.4; }
.mood-info small { color: #999; display: block; margin-top: 5px; }

.empty-state { text-align: center; color: var(--muted); margin-top: 50px; }
.hero .logo { font-size: 2.2rem; }

.hero h1 { margin: 0; font-family: 'Merriweather', serif; letter-spacing: 0.2px; }

.slider { accent-color: var(--primary); }

.emoji-display { font-size: 4.4rem; }

</style>