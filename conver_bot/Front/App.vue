<template>
  <div class="min-h-screen bg-gray-100 py-6">
    <div class="container mx-auto max-w-3xl px-4">
      <div class="bg-white shadow-xl rounded-2xl overflow-hidden">
        <!-- 헤더 섹션 -->
        <div class="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <h1 class="text-2xl font-bold text-center mb-4">실버케어 AI 도우미</h1>
          
          <!-- 날씨 정보 카드 -->
          <div v-if="weatherInfo" class="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm opacity-90">{{ weatherInfo.address }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-2xl font-bold">{{ weatherInfo.temperature }}</span>
                  <span class="text-lg">{{ weatherInfo.sky }}</span>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm">습도: {{ weatherInfo.humidity }}</p>
                <p class="text-sm">강수: {{ weatherInfo.precipitation }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 채팅 컨테이너 -->
        <div ref="chatContainer" class="h-[400px] overflow-y-auto p-6 space-y-4 bg-gray-50">
          <div 
            v-for="(msg, index) in messages" 
            :key="index"
            :class="[
              'p-4 rounded-2xl max-w-[80%] shadow-sm',
              msg.sender === 'user' 
                ? 'bg-blue-500 text-white ml-auto' 
                : 'bg-white mr-auto'
            ]"
          >
            {{ msg.text }}
          </div>
        </div>

        <form @submit.prevent="sendMessage" class="flex gap-2 p-4 bg-white border-t">
          <input 
            v-model="userMessage" 
            type="text" 
            placeholder="메시지를 입력하세요" 
            class="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            전송
          </button>
          <button 
            type="button"
            @click="startVoiceChat"
            :disabled="isListening"
            class="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
          >
            <template v-if="!isListening">음성 입력</template>
            <template v-else>
              <div class="flex flex-col items-center">
                <span class="text-sm">{{ voiceStatus }}</span>
                <span class="flex gap-1 mt-1">
                  <span class="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                  <span class="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
                  <span class="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
                </span>
              </div>
            </template>
          </button>
        </form>

        <!-- 기능 버튼 -->
        <div class="p-4 bg-gray-50 border-t flex space-x-4">
          <button 
            @click="showEmotionalReport" 
            class="flex-1 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
          >
            감정 보고서 보기
          </button>
          <button 
            @click="showKeywords" 
            class="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors shadow-sm"
          >
            키워드 보기
          </button>
        </div>

        <!-- 감정 보고서 -->
        <div v-if="emotionalReport" class="p-6 bg-white border-t">
          <h2 class="text-xl font-bold mb-4">감정 상태 보고서</h2>
          <div class="space-y-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-semibold text-blue-800">전반적인 감정 상태</h3>
              <p class="mt-2">{{ emotionalReport.overall_emotional_state }}</p>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-semibold text-green-800">감정 통찰</h3>
              <p class="mt-2">{{ emotionalReport.emotional_insights }}</p>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <h3 class="font-semibold text-purple-800">권고사항</h3>
              <ul class="mt-2 space-y-2">
                <li v-for="(recommendation, index) in emotionalReport.recommendations" 
                    :key="index"
                    class="flex items-start">
                  <span class="inline-block w-4 h-4 mt-1 mr-2 bg-purple-200 rounded-full"></span>
                  {{ recommendation }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 키워드 -->
        <div v-if="keywords.length > 0" class="p-6 bg-white border-t">
          <h2 class="text-xl font-bold mb-4">오늘의 주요 키워드</h2>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(keyword, index) in keywords" 
              :key="index"
              class="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:bg-green-200 transition-colors"
            >
              #{{ keyword }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 재난 알림 -->
  <div v-if="disasterAlerts.length > 0" class="fixed top-4 right-4 z-50 space-y-2">
    <div v-for="alert in disasterAlerts" 
         :key="alert.SN" 
         class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg max-w-md animate-fade-in">
      <p class="font-bold flex items-center gap-2">
        <span class="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        긴급 재난 알림
      </p>
      <p class="mt-2">{{ alert.MSG_CN }}</p>
      <p class="text-sm mt-2 text-red-500">{{ alert.CRT_DT }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import axios from 'axios'

const userMessage = ref('')
const messages = ref([])
const chatContainer = ref(null)
const sessionId = ref(null)
const audio = ref(new Audio())
const emotionalReport = ref(null)
const keywords = ref([])
const disasterAlerts = ref([])
const weatherInfo = ref(null)
const isListening = ref(false)

const voiceStatus = ref('')

const startVoiceChat = async () => {
  try {
    isListening.value = true
    voiceStatus.value = '"영웅" 이라고 불러주세요'

    const response = await axios.post(
      'http://localhost:8003/voice-chat',
      null,
      {
        params: { session_id: sessionId.value },
        timeout: 180000 // 3분 타임아웃
      }
    )

    if (response.data.success) {
      voiceStatus.value = '말씀해주세요'
      
      // 음성 인식 텍스트를 채팅창에 추가
      if (response.data.transcribed_text) {
        messages.value.push({
          sender: 'user',
          text: response.data.transcribed_text
        })
      }

      // 챗봇 응답 처리
      const chatResponse = response.data.chat_response
      if (chatResponse?.bot_message) {
        messages.value.push({
          sender: 'bot',
          text: chatResponse.bot_message
        })

        if (chatResponse.tts_path) {
          audio.value.src = `http://localhost:8000/${chatResponse.tts_path}`
          await audio.value.play()
        }
      }

      await nextTick()
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    } else {
      console.error('음성 채팅 오류:', response.data.error)
      messages.value.push({
        sender: 'system',
        text: response.data.error || '음성 인식 중 오류가 발생했습니다.'
      })
    }
  } catch (error) {
    console.error('음성 채팅 처리 중 오류:', error)
    let errorMessage = '음성 채팅 처리 중 오류가 발생했습니다.'
    if (error.code === 'ECONNABORTED') {
      errorMessage = '음성 인식 시간이 초과되었습니다. 다시 시도해주세요.'
    }
    messages.value.push({
      sender: 'system',
      text: errorMessage
    })
  } finally {
    isListening.value = false
    voiceStatus.value = ''
  }
}

const sendMessage = async () => {
  if (!userMessage.value.trim()) return

  messages.value.push({
    sender: 'user',
    text: userMessage.value
  })

  try {
    const requestData = {
      user_message: userMessage.value
    }

    if (sessionId.value) {
      requestData.session_id = sessionId.value
    }

    const response = await axios.post('http://localhost:8000/chat', requestData)

    sessionId.value = response.data.session_id

    messages.value.push({
      sender: 'bot',
      text: response.data.bot_message
    })

    if (response.data.tts_path) {
      audio.value.src = `http://localhost:8000/${response.data.tts_path}`
      audio.value.play()
    }

    userMessage.value = ''

    await nextTick()
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  } catch (error) {
    console.error('메시지 전송 중 오류:', error)
    messages.value.push({
      sender: 'bot',
      text: '죄송합니다. 오류가 발생했습니다.'
    })
  }
}

async function showEmotionalReport() {
  try {
    const today = new Date().toISOString().split('T')[0]
    const response = await axios.get(`http://localhost:8001/generate-emotional-report`, {
      params: {
        user_id: 'test_user',
        date: today
      }
    })
    emotionalReport.value = response.data
  } catch (error) {
    console.error('감정 보고서 조회 오류:', error)
  }
}

async function showKeywords() {
  try {
    const today = new Date().toISOString().split('T')[0]
    const response = await axios.get(`http://localhost:8001/generate-keyword`, {
      params: {
        user_id: 'test_user',
        date: today
      }
    })
    keywords.value = response.data.keywords
  } catch (error) {
    console.error('키워드 조회 오류:', error)
  }
}


async function checkDisasterMessages() {
  try {
    const response = await axios.get(
      `http://localhost:8001/disaster-messages/test_user`
    )
    
    if (response.data.has_alerts) {
      disasterAlerts.value = response.data.messages
    }
  } catch (error) {
    console.error('재난문자 확인 중 오류:', error)
  }
}

async function fetchWeatherInfo() {
  try {
    const response = await axios.get(
      'http://localhost:8001/weather-info/test_user'
    )
    weatherInfo.value = response.data
  } catch (error) {
    console.error('날씨 정보 조회 오류:', error)
  }
}


async function playAudioResponse(ttsPath) {
  try {
    audio.value.src = `http://localhost:8000/${ttsPath}`;
    await audio.value.play();
  } catch (error) {
    console.error('오디오 재생 오류:', error);
  }
}

axios.defaults.timeout = 90000;
axios.defaults.retry = 3;
axios.defaults.retryDelay = 1000;

axios.interceptors.response.use(undefined, async (err) => {
  const config = err.config;
  if (!config || !config.retry) return Promise.reject(err);
  
  config.retryCount = config.retryCount || 0;
  
  if (config.retryCount >= config.retry) {
    return Promise.reject(err);
  }
  
  config.retryCount += 1;
  console.log(`요청 재시도 ${config.retryCount}/${config.retry}`);
  
  const delay = config.retryDelay * Math.pow(2, config.retryCount - 1);
  await new Promise(resolve => setTimeout(resolve, delay));
  
  return axios(config);
});

onMounted(() => {
  checkDisasterMessages()
  fetchWeatherInfo()
  setInterval(checkDisasterMessages, 300000) // 5분마다 재난문자 확인
  setInterval(fetchWeatherInfo, 3600000)    // 1시간마다 날씨 정보 갱신
})
</script>

<style>

.animate-fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>