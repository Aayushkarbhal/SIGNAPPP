import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");
const API = "http://localhost:5000";

/* ═══════════════════════════════════════════════════════════════════════════
   TRANSLATIONS
═══════════════════════════════════════════════════════════════════════════ */
const LANGS = {
  en: {
    code: "en", label: "English", flag: "🇬🇧",
    appName: "SignLearn", appTagline: "Learn Sign Language — See, Learn, Sign! 🤟",
    welcomeBack: "Welcome back! 👋", createAccount: "Join SignLearn",
    username: "Your Name", password: "Password", signIn: "Let's Go! 🚀",
    needAccount: "New here? Create account →", alreadyAccount: "Already have account? Login →",
    accountCreated: "Account created! Please login.", invalidCreds: "Oops! Wrong name or password.",
    roleStudent: "🎓 I'm a Student", roleTeacher: "📚 I'm a Teacher",
    teacher: "Teacher", logout: "Logout",
    // tabs
    uploadTab: "📹 Lessons", quizTab: "✏️ Quiz", statsTab: "📊 Progress",
    leadersTab: "🏆 Stars", doubtsTab: "💬 Questions", scheduleTab: "📅 Schedule",
    dictTab: "📖 Dictionary", sotdTab: "🤟 Sign of Day",
    lessonsTab: "📚 Lessons", historyTab: "📈 My Progress", badgesTab: "🎖️ My Badges", myDictTab: "📖 Signs",
    // upload
    uploadLesson: "Upload New Lesson", assignmentNo: "Assignment Number",
    lessonTopic: "Lesson Topic", selectVideo: "Tap to choose video (.mp4 or .webm)",
    saveLesson: "Save Lesson ✅", saving: "Saving...", dueDate: "Quiz Due Date (optional)",
    // quiz creator
    addQuizQuestion: "Create Quiz Question", questionText: "What is the question?",
    questionImage: "Add a Sign Image (optional)", hint: "💡 Hint for students (optional)",
    answerOptions: "Answer Choices", optionText: "Choice",
    correctAnswer: "✅ Correct Answer is", addQuestion: "Add This Question ✅",
    // stats
    liveProgress: "🔴 Live Student Progress", noResults: "No quiz results yet",
    classLeaderboard: "🌟 Star Students", noData: "No stars yet — take some quizzes!",
    quizzesTaken: "quizzes", best: "Best", uploading: "Uploading...",
    lessonSaved: "✅ Lesson saved!", questionAdded: "✅ Question added!",
    fillAllFields: "Please fill all fields!", selectVideoFile: "Please choose a video file",
    easy: "Easy 🟢", medium: "Medium 🟡", hard: "Hard 🔴", attempt: "Try",
    // student home
    myStudyRoom: "My Learning Space 🌈", lessonsAvailable: "Lessons", quizzesDone: "Quizzes Done",
    avgScore: "My Score", teachersTip: "💡 Teacher says:",
    searchLessons: "🔍 Search lessons...", noLessons: "No lessons yet — check back soon! 😊",
    noSearchResults: "No lessons found for that search",
    watchThenQuiz: "👀 Watch the video first, then take the quiz!", startTest: "Take Quiz 📝",
    noHistory: "No quizzes taken yet. Start learning!",
    loadingQuiz: "Loading your quiz... 🤟", noQuestions: "No questions for this quiz yet.",
    goBack: "Go Back", assignment: "Lesson", previous: "← Back", next: "Next →",
    submitTest: "Submit My Answers 🚀", answerAll: "Please answer all questions!",
    remaining: "left", useHint: "💡 Show Hint", hintLabel: "💡 Hint:",
    backToLessons: "Back to Lessons", scoreBreakdown: "Your Answers",
    correctAnswer2: "Answer:", xpEarned: "XP", attemptNo: "Try #",
    // countdown
    dueIn: "Due in", overdue: "OVERDUE ⚠️", noDueDate: "No due date",
    daysLeft: "days", hoursLeft: "hours", minsLeft: "min",
    setDueDate: "Set Due Date", updateDue: "Update",
    // doubt
    doubtBox: "💬 Ask a Question", askDoubt: "Have a question? Ask here!",
    doubtPlaceholder: "Type your question about this lesson...",
    submitDoubt: "Ask! 🙋", noDoubts: "No questions yet. Ask the first one!",
    teacherAnswer: "Teacher's Answer 👩‍🏫", unanswered: "Waiting for teacher's answer... ⏳",
    replyPlaceholder: "Type your answer...", sendReply: "Reply ✅",
    allDoubts: "All Student Questions", doubtFor: "Lesson",
    // badges
    myBadges: "My Badges 🎖️", noBadges: "Keep learning to earn badges! 💪",
    earned: "Earned", allBadges: "All Badges You Can Earn",
    locked: "Not yet earned",
    // sign of day
    signOfDay: "🤟 Sign of the Day", todaysSign: "Today's Sign",
    setSignOfDay: "Set Today's Sign", signWord: "Sign Word (e.g. Hello)",
    signDesc: "How to do this sign...", addSignImage: "Add Sign Image",
    saveSign: "Set as Today's Sign 🤟",
    // dictionary
    visualDict: "📖 Sign Dictionary", searchSigns: "🔍 Search signs...",
    allCategories: "All", addToDictionary: "Add New Sign",
    dictWord: "Sign Word", dictCategory: "Category", dictDesc: "Description (optional)",
    dictImage: "Sign Image *", saveDictEntry: "Add to Dictionary",
    noDictEntries: "No signs in dictionary yet.",
  },
  hi: {
    code: "hi", label: "हिंदी", flag: "🇮🇳",
    appName: "SignLearn", appTagline: "सांकेतिक भाषा सीखें — देखें, सीखें, करें! 🤟",
    welcomeBack: "वापस स्वागत है! 👋", createAccount: "SignLearn से जुड़ें",
    username: "आपका नाम", password: "पासवर्ड", signIn: "चलते हैं! 🚀",
    needAccount: "नए हैं? खाता बनाएं →", alreadyAccount: "पहले से खाता है? लॉगिन →",
    accountCreated: "खाता बना! लॉगिन करें।", invalidCreds: "ओह! नाम या पासवर्ड गलत है।",
    roleStudent: "🎓 मैं छात्र हूँ", roleTeacher: "📚 मैं शिक्षक हूँ",
    teacher: "शिक्षक", logout: "लॉगआउट",
    uploadTab: "📹 पाठ", quizTab: "✏️ प्रश्नोत्तरी", statsTab: "📊 प्रगति",
    leadersTab: "🏆 स्टार", doubtsTab: "💬 प्रश्न", scheduleTab: "📅 समय-सारणी",
    dictTab: "📖 शब्दकोश", sotdTab: "🤟 आज का संकेत",
    lessonsTab: "📚 पाठ", historyTab: "📈 मेरी प्रगति", badgesTab: "🎖️ मेरे बैज", myDictTab: "📖 संकेत",
    uploadLesson: "नया पाठ अपलोड करें", assignmentNo: "असाइनमेंट नंबर",
    lessonTopic: "पाठ का विषय", selectVideo: "वीडियो चुनें (.mp4 या .webm)",
    saveLesson: "पाठ सहेजें ✅", saving: "सहेजा जा रहा है...", dueDate: "नियत तारीख (वैकल्पिक)",
    addQuizQuestion: "प्रश्न बनाएं", questionText: "प्रश्न क्या है?",
    questionImage: "संकेत की छवि (वैकल्पिक)", hint: "💡 छात्रों के लिए संकेत (वैकल्पिक)",
    answerOptions: "उत्तर के विकल्प", optionText: "विकल्प",
    correctAnswer: "✅ सही उत्तर है", addQuestion: "यह प्रश्न जोड़ें ✅",
    liveProgress: "🔴 छात्रों की लाइव प्रगति", noResults: "अभी कोई परिणाम नहीं",
    classLeaderboard: "🌟 होनहार छात्र", noData: "अभी कोई स्टार नहीं!",
    quizzesTaken: "प्रश्नोत्तरी", best: "सर्वश्रेष्ठ", uploading: "अपलोड हो रहा है...",
    lessonSaved: "✅ पाठ सहेजा!", questionAdded: "✅ प्रश्न जोड़ा!", fillAllFields: "सभी फ़ील्ड भरें!",
    selectVideoFile: "वीडियो फ़ाइल चुनें", easy: "आसान 🟢", medium: "मध्यम 🟡", hard: "कठिन 🔴", attempt: "प्रयास",
    myStudyRoom: "मेरा अध्ययन स्थान 🌈", lessonsAvailable: "पाठ", quizzesDone: "प्रश्नोत्तरी",
    avgScore: "मेरे अंक", teachersTip: "💡 शिक्षक कहते हैं:",
    searchLessons: "🔍 पाठ खोजें...", noLessons: "अभी कोई पाठ नहीं!",
    noSearchResults: "कोई पाठ नहीं मिला", watchThenQuiz: "👀 पहले वीडियो देखें, फिर प्रश्नोत्तरी दें!",
    startTest: "प्रश्नोत्तरी दें 📝", noHistory: "अभी कोई प्रश्नोत्तरी नहीं।",
    loadingQuiz: "लोड हो रहा है... 🤟", noQuestions: "इस पाठ के लिए कोई प्रश्न नहीं।",
    goBack: "वापस जाएं", assignment: "पाठ", previous: "← वापस", next: "आगे →",
    submitTest: "उत्तर जमा करें 🚀", answerAll: "सभी प्रश्नों के उत्तर दें!",
    remaining: "बाकी", useHint: "💡 संकेत दिखाएं", hintLabel: "💡 संकेत:",
    backToLessons: "पाठों पर वापस", scoreBreakdown: "आपके उत्तर",
    correctAnswer2: "उत्तर:", xpEarned: "XP", attemptNo: "प्रयास #",
    dueIn: "में समय सीमा", overdue: "समय सीमा पार ⚠️", noDueDate: "कोई समय सीमा नहीं",
    daysLeft: "दिन", hoursLeft: "घंटे", minsLeft: "मिनट",
    setDueDate: "नियत तारीख सेट करें", updateDue: "अपडेट करें",
    doubtBox: "💬 प्रश्न पूछें", askDoubt: "कोई सवाल है? यहाँ पूछें!",
    doubtPlaceholder: "इस पाठ के बारे में प्रश्न लिखें...",
    submitDoubt: "पूछें! 🙋", noDoubts: "अभी कोई प्रश्न नहीं।",
    teacherAnswer: "शिक्षक का उत्तर 👩‍🏫", unanswered: "शिक्षक का उत्तर आने वाला है... ⏳",
    replyPlaceholder: "अपना उत्तर लिखें...", sendReply: "उत्तर दें ✅",
    allDoubts: "सभी छात्रों के प्रश्न", doubtFor: "पाठ",
    myBadges: "मेरे बैज 🎖️", noBadges: "बैज कमाने के लिए पढ़ते रहें! 💪",
    earned: "मिला", allBadges: "सभी बैज जो मिल सकते हैं", locked: "अभी नहीं मिला",
    signOfDay: "🤟 आज का संकेत", todaysSign: "आज का संकेत",
    setSignOfDay: "आज का संकेत सेट करें", signWord: "संकेत शब्द (जैसे: नमस्ते)",
    signDesc: "यह संकेत कैसे करें...", addSignImage: "संकेत की छवि जोड़ें",
    saveSign: "आज का संकेत सेट करें 🤟",
    visualDict: "📖 संकेत शब्दकोश", searchSigns: "🔍 संकेत खोजें...",
    allCategories: "सभी", addToDictionary: "नया संकेत जोड़ें",
    dictWord: "संकेत शब्द", dictCategory: "श्रेणी", dictDesc: "विवरण (वैकल्पिक)",
    dictImage: "संकेत छवि *", saveDictEntry: "शब्दकोश में जोड़ें",
    noDictEntries: "शब्दकोश में अभी कोई संकेत नहीं।",
  },
  mr: {
    code: "mr", label: "मराठी", flag: "🇮🇳",
    appName: "SignLearn", appTagline: "सांकेतिक भाषा शिका — पहा, शिका, करा! 🤟",
    welcomeBack: "परत स्वागत! 👋", createAccount: "SignLearn मध्ये सामील व्हा",
    username: "तुमचे नाव", password: "पासवर्ड", signIn: "चला शिकूया! 🚀",
    needAccount: "नवीन आहात? खाते तयार करा →", alreadyAccount: "आधीच खाते आहे? लॉगिन →",
    accountCreated: "खाते तयार! लॉगिन करा.", invalidCreds: "अरे! नाव किंवा पासवर्ड चुकीचे.",
    roleStudent: "🎓 मी विद्यार्थी आहे", roleTeacher: "📚 मी शिक्षक आहे",
    teacher: "शिक्षक", logout: "लॉगआउट",
    uploadTab: "📹 धडे", quizTab: "✏️ प्रश्नमंजुषा", statsTab: "📊 प्रगती",
    leadersTab: "🏆 तारे", doubtsTab: "💬 प्रश्न", scheduleTab: "📅 वेळापत्रक",
    dictTab: "📖 शब्दकोश", sotdTab: "🤟 आजची खूण",
    lessonsTab: "📚 धडे", historyTab: "📈 माझी प्रगती", badgesTab: "🎖️ माझे बॅज", myDictTab: "📖 खुणा",
    uploadLesson: "नवीन धडा अपलोड करा", assignmentNo: "असाइनमेंट क्रमांक",
    lessonTopic: "धड्याचा विषय", selectVideo: "व्हिडिओ निवडा (.mp4 किंवा .webm)",
    saveLesson: "धडा जतन करा ✅", saving: "जतन होत आहे...", dueDate: "अंतिम तारीख (पर्यायी)",
    addQuizQuestion: "प्रश्न तयार करा", questionText: "प्रश्न काय आहे?",
    questionImage: "खुणेचा फोटो (पर्यायी)", hint: "💡 विद्यार्थ्यांसाठी संकेत (पर्यायी)",
    answerOptions: "उत्तराचे पर्याय", optionText: "पर्याय",
    correctAnswer: "✅ बरोबर उत्तर आहे", addQuestion: "हा प्रश्न जोडा ✅",
    liveProgress: "🔴 विद्यार्थ्यांची थेट प्रगती", noResults: "अजून कोणतेही निकाल नाहीत",
    classLeaderboard: "🌟 हुशार विद्यार्थी", noData: "अजून कोणी तारा नाही!",
    quizzesTaken: "प्रश्नमंजुषा", best: "सर्वोत्तम", uploading: "अपलोड होत आहे...",
    lessonSaved: "✅ धडा जतन!", questionAdded: "✅ प्रश्न जोडला!", fillAllFields: "सर्व फील्ड भरा!",
    selectVideoFile: "व्हिडिओ फाइल निवडा", easy: "सोपे 🟢", medium: "मध्यम 🟡", hard: "कठीण 🔴", attempt: "प्रयत्न",
    myStudyRoom: "माझी अभ्यासिका 🌈", lessonsAvailable: "धडे", quizzesDone: "प्रश्नमंजुषा",
    avgScore: "माझे गुण", teachersTip: "💡 शिक्षक म्हणतात:",
    searchLessons: "🔍 धडे शोधा...", noLessons: "अजून धडे नाहीत!",
    noSearchResults: "कोणताही धडा सापडला नाही", watchThenQuiz: "👀 आधी व्हिडिओ पहा, मग प्रश्नमंजुषा द्या!",
    startTest: "प्रश्नमंजुषा द्या 📝", noHistory: "अजून प्रश्नमंजुषा नाही.",
    loadingQuiz: "लोड होत आहे... 🤟", noQuestions: "या धड्यासाठी अजून प्रश्न नाहीत.",
    goBack: "मागे जा", assignment: "धडा", previous: "← मागे", next: "पुढे →",
    submitTest: "उत्तरे सादर करा 🚀", answerAll: "सर्व प्रश्नांची उत्तरे द्या!",
    remaining: "बाकी", useHint: "💡 संकेत दाखवा", hintLabel: "💡 संकेत:",
    backToLessons: "धड्यांकडे परत", scoreBreakdown: "तुमची उत्तरे",
    correctAnswer2: "उत्तर:", xpEarned: "XP", attemptNo: "प्रयत्न #",
    dueIn: "मध्ये अंतिम मुदत", overdue: "मुदत संपली ⚠️", noDueDate: "अंतिम तारीख नाही",
    daysLeft: "दिवस", hoursLeft: "तास", minsLeft: "मिनिटे",
    setDueDate: "अंतिम तारीख सेट करा", updateDue: "अपडेट करा",
    doubtBox: "💬 प्रश्न विचारा", askDoubt: "काही प्रश्न आहे? इथे विचारा!",
    doubtPlaceholder: "या धड्याबद्दल प्रश्न लिहा...",
    submitDoubt: "विचारा! 🙋", noDoubts: "अजून प्रश्न नाहीत.",
    teacherAnswer: "शिक्षकांचे उत्तर 👩‍🏫", unanswered: "शिक्षकांचे उत्तर येईल... ⏳",
    replyPlaceholder: "तुमचे उत्तर लिहा...", sendReply: "उत्तर द्या ✅",
    allDoubts: "सर्व विद्यार्थ्यांचे प्रश्न", doubtFor: "धडा",
    myBadges: "माझे बॅज 🎖️", noBadges: "बॅज मिळवण्यासाठी शिकत राहा! 💪",
    earned: "मिळाले", allBadges: "सर्व बॅज जे मिळू शकतात", locked: "अजून मिळाले नाही",
    signOfDay: "🤟 आजची खूण", todaysSign: "आजची खूण",
    setSignOfDay: "आजची खूण सेट करा", signWord: "खुणेचा शब्द (उदा: नमस्कार)",
    signDesc: "ही खूण कशी करायची...", addSignImage: "खुणेचा फोटो जोडा",
    saveSign: "आजची खूण सेट करा 🤟",
    visualDict: "📖 खुणांचा शब्दकोश", searchSigns: "🔍 खूण शोधा...",
    allCategories: "सर्व", addToDictionary: "नवीन खूण जोडा",
    dictWord: "खुणेचा शब्द", dictCategory: "श्रेणी", dictDesc: "वर्णन (पर्यायी)",
    dictImage: "खुणेचा फोटो *", saveDictEntry: "शब्दकोशात जोडा",
    noDictEntries: "शब्दकोशात अजून खुणा नाहीत.",
  }
};

const LangContext = createContext();
const useLang = () => useContext(LangContext);
const LangProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  const t = LANGS[lang];
  const switchLang = (code) => { setLang(code); localStorage.setItem("lang", code); };
  return <LangContext.Provider value={{ lang, t, switchLang, LANGS }}>{children}</LangContext.Provider>;
};

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED SMALL COMPONENTS
═══════════════════════════════════════════════════════════════════════════ */
const LangSwitcher = () => {
  const { lang, switchLang, LANGS } = useLang();
  return (
    <div className="flex gap-1 p-1 rounded-2xl bg-white/20 backdrop-blur-sm">
      {Object.values(LANGS).map(l => (
        <button key={l.code} onClick={() => switchLang(l.code)}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all
          ${lang === l.code ? "bg-white text-teal-700 shadow-md" : "text-white/80 hover:text-white"}`}>
          {l.flag} {l.label}
        </button>
      ))}
    </div>
  );
};

const DiffBadge = ({ level }) => {
  const { t } = useLang();
  const map = { easy: "bg-green-100 text-green-700 border-green-200", medium: "bg-amber-100 text-amber-700 border-amber-200", hard: "bg-red-100 text-red-700 border-red-200" };
  return <span className={`text-xs font-black px-3 py-1 rounded-full border ${map[level] || map.medium}`}>{t[level.split(' ')[0]] || level}</span>;
};

const CountdownBadge = ({ dueDate }) => {
  const { t } = useLang();
  const [display, setDisplay] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [late, setLate] = useState(false);
  useEffect(() => {
    if (!dueDate) return;
    const tick = () => {
      const diff = new Date(dueDate) - new Date();
      if (diff <= 0) { setLate(true); setDisplay(t.overdue); return; }
      setLate(false);
      const days = Math.floor(diff / 86400000), hrs = Math.floor((diff % 86400000) / 3600000), mins = Math.floor((diff % 3600000) / 60000);
      setUrgent(diff < 86400000);
      setDisplay(days > 0 ? `${days} ${t.daysLeft}` : hrs > 0 ? `${hrs} ${t.hoursLeft}` : `${mins} ${t.minsLeft}`);
    };
    tick(); const id = setInterval(tick, 30000); return () => clearInterval(id);
  }, [dueDate, t]);
  if (!dueDate) return null;
  return (
    <span className={`text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 w-fit
      ${late ? "bg-red-100 text-red-700" : urgent ? "bg-orange-100 text-orange-700 animate-pulse" : "bg-sky-100 text-sky-700"}`}>
      ⏰ {display}
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   BADGE DISPLAY
═══════════════════════════════════════════════════════════════════════════ */
const BadgeCard = ({ badge, locked = false }) => (
  <div className={`flex flex-col items-center p-5 rounded-3xl border-2 text-center transition-all
    ${locked ? "border-slate-100 bg-slate-50 opacity-50" : "border-amber-200 bg-gradient-to-b from-amber-50 to-white shadow-md hover:shadow-lg hover:-translate-y-1"}`}>
    <span className="text-5xl mb-2">{badge.emoji}</span>
    <p className="font-black text-sm text-slate-800">{badge.label}</p>
    <p className="text-xs text-slate-500 mt-1">{badge.desc}</p>
    {badge.earned_at && !locked && <p className="text-xs text-amber-600 font-bold mt-2">🗓 {badge.earned_at}</p>}
    {locked && <p className="text-xs text-slate-400 font-bold mt-2">🔒 Not yet</p>}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   SIGN OF DAY CARD
═══════════════════════════════════════════════════════════════════════════ */
const SignOfDayCard = () => {
  const { t } = useLang();
  const [sign, setSign] = useState(null);
  useEffect(() => { axios.get(`${API}/sign_of_day`).then(r => setSign(r.data)); }, []);
  if (!sign) return null;
  return (
    <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl p-6 text-white shadow-xl mb-6 flex items-center gap-5">
      <div className="text-6xl animate-bounce">🤟</div>
      <div className="flex-1">
        <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-1">{t.todaysSign} · {sign.date}</p>
        <h2 className="text-3xl font-black">{sign.word}</h2>
        <p className="text-sm mt-1 opacity-90">{sign.description}</p>
      </div>
      {sign.image_url && (
        <img src={sign.image_url} alt={sign.word} className="w-24 h-24 rounded-2xl object-cover border-4 border-white/30 shadow-lg flex-shrink-0" />
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   VISUAL DICTIONARY VIEWER
═══════════════════════════════════════════════════════════════════════════ */
const DictionaryViewer = () => {
  const { t } = useLang();
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${API}/dictionary`).then(r => setEntries(r.data));
    axios.get(`${API}/dictionary/categories`).then(r => setCategories(r.data));
  }, []);

  const filtered = entries.filter(e => {
    const matchSearch = e.word.toLowerCase().includes(search.toLowerCase()) || (e.description || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || e.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <div className="flex gap-3 mb-5 flex-wrap">
        <input className="flex-1 min-w-48 p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold focus:border-teal-400 outline-none text-sm"
          placeholder={t.searchSigns} value={search} onChange={e => setSearch(e.target.value)} />
        <div className="flex gap-2 flex-wrap">
          {["All", ...categories].map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-2xl text-sm font-black transition-all
              ${category === c ? "bg-teal-500 text-white shadow" : "bg-white border-2 border-slate-200 text-slate-600 hover:border-teal-300"}`}>
              {c === "All" ? t.allCategories : c}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0
        ? <div className="text-center py-16"><p className="text-5xl mb-3">🔍</p><p className="text-slate-400 font-bold">{t.noDictEntries}</p></div>
        : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map(e => (
            <div key={e.id} className="bg-white rounded-3xl border-2 border-slate-100 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="aspect-square bg-slate-50 overflow-hidden">
                <img src={e.image_url} alt={e.word} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="font-black text-slate-800 text-sm">{e.word}</p>
                <p className="text-xs text-teal-600 font-bold">{e.category}</p>
                {e.description && <p className="text-xs text-slate-400 mt-1 truncate">{e.description}</p>}
              </div>
            </div>
          ))}
        </div>}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   DOUBT BOX
═══════════════════════════════════════════════════════════════════════════ */
const DoubtBox = ({ ano, username, isTeacher }) => {
  const { t } = useLang();
  const [doubts, setDoubts] = useState([]);
  const [newQ, setNewQ] = useState("");
  const [replyText, setReplyText] = useState({});
  const [openId, setOpenId] = useState(null);
  const [posting, setPosting] = useState(false);

  const load = useCallback(() => {
    const url = isTeacher ? `${API}/teacher/doubts` : `${API}/student/doubts/${ano}`;
    axios.get(url).then(r => setDoubts(r.data));
  }, [ano, isTeacher]);

  useEffect(() => {
    load();
    socket.on("new_doubt", d => { if (isTeacher || d.assignment_no === ano) setDoubts(p => [d, ...p]); });
    socket.on("doubt_replied", ({ doubt_id, reply }) => {
      setDoubts(p => p.map(d => d.id === doubt_id ? { ...d, replies: [...d.replies, reply] } : d));
    });
    return () => { socket.off("new_doubt"); socket.off("doubt_replied"); };
  }, [load]);

  const submitDoubt = async () => {
    if (!newQ.trim()) return;
    setPosting(true);
    await axios.post(`${API}/student/doubts`, { username, assignment_no: ano, question: newQ });
    setNewQ(""); setPosting(false);
  };

  const submitReply = async (id) => {
    if (!replyText[id]?.trim()) return;
    await axios.post(`${API}/teacher/doubts/${id}/reply`, { author: username, body: replyText[id] });
    setReplyText(p => ({ ...p, [id]: "" }));
  };

  return (
    <div className="space-y-3">
      {!isTeacher && (
        <div className="bg-teal-50 border-2 border-teal-200 rounded-3xl p-5">
          <p className="font-black text-teal-700 mb-3">{t.askDoubt}</p>
          <textarea className="w-full p-3 bg-white border-2 border-teal-200 rounded-2xl font-medium text-sm focus:border-teal-400 outline-none resize-none"
            rows={3} placeholder={t.doubtPlaceholder} value={newQ} onChange={e => setNewQ(e.target.value)} />
          <button onClick={submitDoubt} disabled={posting || !newQ.trim()}
            className="mt-2 bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-2xl font-black text-sm disabled:opacity-40 transition">
            {posting ? "..." : t.submitDoubt}
          </button>
        </div>
      )}
      {doubts.length === 0
        ? <p className="text-center py-6 text-slate-400 font-bold">{t.noDoubts}</p>
        : doubts.map(d => (
          <div key={d.id} className="bg-white rounded-2xl border-2 border-slate-100 overflow-hidden">
            <button className="w-full p-4 text-left flex justify-between items-start gap-3"
              onClick={() => setOpenId(openId === d.id ? null : d.id)}>
              <div className="flex-1">
                {isTeacher && <span className="text-xs font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full mr-2">{t.doubtFor} {d.assignment_no}</span>}
                <span className="text-xs text-slate-400 font-bold">{d.student_name} · {d.created_at}</span>
                <p className="font-bold text-slate-800 mt-0.5 text-sm">{d.question}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {d.replies.length > 0
                  ? <span className="text-xs bg-green-100 text-green-700 font-black px-2 py-1 rounded-full">✓ {d.replies.length}</span>
                  : <span className="text-xs bg-amber-100 text-amber-700 font-black px-2 py-1 rounded-full">⏳</span>}
                <span className="text-slate-300">{openId === d.id ? "▲" : "▼"}</span>
              </div>
            </button>
            {openId === d.id && (
              <div className="border-t-2 border-slate-100 bg-slate-50 p-4 space-y-3">
                {d.replies.length === 0 && <p className="text-sm italic text-slate-400">{t.unanswered}</p>}
                {d.replies.map(r => (
                  <div key={r.id} className="bg-teal-50 border border-teal-100 rounded-2xl p-3">
                    <p className="text-xs font-black text-teal-600 mb-1">👩‍🏫 {r.author} · {r.created_at}</p>
                    <p className="text-sm font-medium text-slate-800">{r.body}</p>
                  </div>
                ))}
                {isTeacher && (
                  <div className="flex gap-2">
                    <input className="flex-1 p-2 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:border-teal-400 outline-none"
                      placeholder={t.replyPlaceholder} value={replyText[d.id] || ""}
                      onChange={e => setReplyText(p => ({ ...p, [d.id]: e.target.value }))}
                      onKeyDown={e => e.key === "Enter" && submitReply(d.id)} />
                    <button onClick={() => submitReply(d.id)}
                      className="bg-teal-500 text-white px-4 py-2 rounded-xl font-black text-sm hover:bg-teal-600 transition">
                      {t.sendReply}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   TIMER HOOK
═══════════════════════════════════════════════════════════════════════════ */
const useTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const ref = useRef(null);
  const start = useCallback(() => { ref.current = setInterval(() => setSeconds(s => s + 1), 1000); }, []);
  const stop = useCallback(() => { clearInterval(ref.current); return seconds; }, [seconds]);
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  return { seconds, start, stop, fmt };
};

/* ═══════════════════════════════════════════════════════════════════════════
   QUIZ OVERLAY — accessible, visual-first design
═══════════════════════════════════════════════════════════════════════════ */
const QuizOverlay = ({ user, topic, ano, onClose }) => {
  const { t } = useLang();
  const [qs, setQs] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [hintUsed, setHintUsed] = useState({});
  const [error, setError] = useState("");
  const [newBadge, setNewBadge] = useState(null);
  const { seconds, start, stop, fmt } = useTimer();

  useEffect(() => {
    axios.get(`${API}/student/quiz/${ano}`).then(r => { setQs(r.data); setLoading(false); start(); });
    socket.on("new_badge", ({ student, badge }) => {
      if (student === user.username) { setNewBadge(badge); setTimeout(() => setNewBadge(null), 4000); }
    });
    return () => socket.off("new_badge");
  }, [ano]);

  const submitForm = async () => {
    if (Object.keys(answers).length < qs.length) {
      setError(`${t.answerAll} (${qs.length - Object.keys(answers).length} ${t.remaining})`); return;
    }
    setError("");
    let hits = 0;
    qs.forEach((q, i) => { if (answers[i]?.toUpperCase() === q.correct?.toUpperCase()) hits++; });
    const pct = Math.round((hits / (qs.length || 1)) * 100);
    const timeTaken = stop();
    const r = await axios.post(`${API}/submit_quiz`, { username: user.username, topic, score: pct, time_taken: timeTaken });
    setResult(r.data);
  };

  const q = qs[current];

  if (loading) return (
    <div className="fixed inset-0 bg-teal-900 z-[200] flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl animate-bounce mb-4">🤟</div>
        <p className="text-white font-black text-2xl">{t.loadingQuiz}</p>
      </div>
    </div>
  );

  if (qs.length === 0) return (
    <div className="fixed inset-0 bg-teal-900 z-[200] flex items-center justify-center">
      <div className="text-center text-white">
        <p className="text-6xl mb-4">📭</p>
        <p className="text-2xl font-black">{t.noQuestions}</p>
        <button onClick={() => onClose(null)} className="mt-6 bg-white text-teal-700 px-8 py-3 rounded-full font-black">{t.goBack}</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-50 z-[200] overflow-y-auto">
      {/* Badge pop-up */}
      {newBadge && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] bg-amber-400 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="text-4xl">{newBadge.emoji}</span>
          <div><p className="font-black text-lg">New Badge!</p><p className="font-bold">{newBadge.label}</p></div>
        </div>
      )}

      {!result ? (
        <div className="max-w-3xl mx-auto p-4 md:p-8 pb-32">
          {/* Header */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-slate-100 mb-6 flex justify-between items-center sticky top-4 z-10 flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-black text-slate-800">{t.assignment} {ano}: {topic}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <div className="flex gap-1.5 flex-wrap">
                  {qs.map((_, i) => (
                    <button key={i} onClick={() => setCurrent(i)}
                      className={`w-8 h-8 rounded-full text-xs font-black border-2 transition-all
                      ${answers[i] ? "bg-teal-500 text-white border-teal-500" : i === current ? "border-teal-500 text-teal-600" : "border-slate-200 text-slate-400"}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-teal-50 text-teal-700 px-4 py-2 rounded-2xl font-black text-lg tabular-nums border-2 border-teal-200">⏱ {fmt(seconds)}</div>
              <button onClick={() => onClose(null)} className="bg-red-50 text-red-500 font-black text-sm px-4 py-2 rounded-2xl border-2 border-red-100">✕ Exit</button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200 rounded-full h-3 mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-400 to-cyan-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(Object.keys(answers).length / qs.length) * 100}%` }} />
          </div>

          {/* Question card */}
          {q && (
            <div className="bg-white rounded-3xl shadow-sm border-2 border-slate-100 p-6 md:p-8 mb-4">
              <div className="flex items-start justify-between gap-4 mb-5">
                <h2 className="text-2xl font-black text-slate-800 leading-tight">{current + 1}. {q.text}</h2>
                <DiffBadge level={q.difficulty} />
              </div>

              {/* Big sign image — front and center for deaf learners */}
              {q.image && (
                <div className="flex justify-center mb-6">
                  <div className="bg-teal-50 border-4 border-teal-200 rounded-3xl overflow-hidden shadow-inner p-2">
                    <img src={q.image} alt="Sign" className="max-h-64 w-auto rounded-2xl object-contain" />
                  </div>
                </div>
              )}

              {q.hint && (
                <div className="mb-5">
                  {!hintUsed[current]
                    ? <button onClick={() => setHintUsed({ ...hintUsed, [current]: true })}
                      className="text-sm font-bold text-amber-600 bg-amber-50 px-5 py-2 rounded-2xl border-2 border-amber-200 hover:bg-amber-100 transition">
                      {t.useHint}
                    </button>
                    : <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex items-center gap-3">
                      <span className="text-2xl">💡</span>
                      <p className="text-sm font-bold text-amber-700">{q.hint}</p>
                    </div>}
                </div>
              )}

              {/* Answer options — large, visual, accessible */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["A", "B", "C", "D"].map(opt => {
                  const isSelected = answers[current]?.toUpperCase() === opt;
                  const optImg = q[`img_${opt.toLowerCase()}`];
                  return (
                    <button key={opt} onClick={() => setAnswers({ ...answers, [current]: opt })}
                      className={`rounded-3xl text-left border-4 transition-all duration-200 overflow-hidden
                      ${isSelected ? "border-teal-500 shadow-lg scale-[1.02]" : "border-slate-100 hover:border-teal-200 hover:scale-[1.01]"}`}>
                      {optImg && (
                        <div className={`w-full aspect-video overflow-hidden ${isSelected ? "bg-teal-50" : "bg-slate-50"}`}>
                          <img src={optImg} alt={`Option ${opt}`} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className={`flex items-center gap-3 p-4 ${isSelected ? "bg-teal-50" : "bg-white"}`}>
                        <span className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-black flex-shrink-0
                          ${isSelected ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-600"}`}>{opt}</span>
                        <span className={`font-bold ${isSelected ? "text-teal-800" : "text-slate-700"}`}>{q[opt.toLowerCase()]}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mb-4">
            <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
              className="flex-1 bg-white border-2 border-slate-200 font-black py-4 rounded-2xl disabled:opacity-30 hover:bg-slate-50 transition">
              {t.previous}
            </button>
            {current < qs.length - 1
              ? <button onClick={() => setCurrent(current + 1)} className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-black py-4 rounded-2xl transition">{t.next}</button>
              : <button onClick={submitForm} className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-black py-4 rounded-2xl hover:opacity-90 transition">{t.submitTest}</button>}
          </div>
          {error && <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-center"><p className="text-red-600 font-bold">⚠️ {error}</p></div>}
        </div>
      ) : (
        /* RESULT SCREEN */
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-teal-50">
          <div className="max-w-lg w-full space-y-5">
            <div className={`p-10 rounded-[2.5rem] text-white text-center shadow-2xl
              ${result.color === "gold" ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                : result.color === "green" ? "bg-gradient-to-br from-teal-500 to-emerald-600"
                  : result.color === "blue" ? "bg-gradient-to-br from-sky-500 to-blue-600"
                    : result.color === "orange" ? "bg-gradient-to-br from-orange-400 to-red-500"
                      : "bg-gradient-to-br from-rose-500 to-red-600"}`}>
              <div className="text-8xl mb-3">{result.emoji}</div>
              <h2 className="text-8xl font-black">{result.score}%</h2>
              <p className="text-2xl font-black mt-2 uppercase tracking-wide">{result.prediction}</p>
              <div className="bg-white/20 backdrop-blur-sm p-5 rounded-2xl mt-5">
                <p className="text-lg font-bold">{result.suggestion}</p>
              </div>
              <div className="flex justify-center gap-5 mt-5 text-sm font-bold opacity-80">
                <span>⚡ +{result.xp} {t.xpEarned}</span>
                <span>🔁 {t.attemptNo}{result.attempt_no}</span>
              </div>
            </div>

            {/* Answer review */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-slate-100">
              <h3 className="font-black text-slate-700 text-sm uppercase tracking-widest mb-3">{t.scoreBreakdown}</h3>
              <div className="space-y-2">
                {qs.map((q, i) => {
                  const correct = answers[i]?.toUpperCase() === q.correct?.toUpperCase();
                  return (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-2xl ${correct ? "bg-green-50 border-2 border-green-100" : "bg-red-50 border-2 border-red-100"}`}>
                      <span className={`text-xl font-black ${correct ? "text-green-500" : "text-red-400"}`}>{correct ? "✓" : "✗"}</span>
                      <span className="text-sm font-bold text-slate-700 flex-1 truncate">Q{i + 1}: {q.text}</span>
                      {!correct && <span className="text-xs font-black text-slate-500 bg-white px-2 py-1 rounded-full">{t.correctAnswer2} {q.correct}</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={() => onClose(result.suggestion)}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-5 rounded-2xl text-xl font-black hover:opacity-90 transition shadow-lg">
              {t.backToLessons} 🏠
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   AUTH PAGE
═══════════════════════════════════════════════════════════════════════════ */
const Auth = ({ setAuth }) => {
  const { t } = useLang();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", password: "", role: "student" });
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    try {
      const r = await axios.post(`${API}/${isLogin ? "login" : "register"}`, form);
      if (isLogin) {
        const u = { loggedIn: true, ...r.data };
        localStorage.setItem("user", JSON.stringify(u));
        setAuth(u); navigate(`/${r.data.role}`);
      } else { alert(t.accountCreated); setIsLogin(true); }
    } catch (err) { alert(err.response?.data?.error || t.invalidCreds); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-400 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background signs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {["🤟", "👐", "🙌", "👋", "✌️", "🤙", "👍", "🖐"].map((e, i) => (
          <div key={i} className="absolute text-white/10 text-8xl font-black animate-pulse"
            style={{ top: `${10 + i * 12}%`, left: `${i % 2 === 0 ? 5 : 80}%`, animationDelay: `${i * 0.5}s`, fontSize: `${60 + i * 10}px` }}>
            {e}
          </div>
        ))}
      </div>

      <div className="w-full max-w-md relative">
        <div className="flex justify-center mb-6"><LangSwitcher /></div>
        <div className="text-center mb-8">
          <div className="text-7xl mb-3">🤟</div>
          <h1 className="text-5xl font-black text-white tracking-tight">{t.appName}</h1>
          <p className="text-white/80 mt-2 font-bold">{t.appTagline}</p>
        </div>
        <form onSubmit={handle} className="bg-white rounded-[2.5rem] p-8 shadow-2xl space-y-4">
          <h2 className="text-2xl font-black text-slate-800">{isLogin ? t.welcomeBack : t.createAccount}</h2>
          <input required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-lg focus:border-teal-400 outline-none transition"
            placeholder={t.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          <input required type="password" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-lg focus:border-teal-400 outline-none transition"
            placeholder={t.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              {[{ val: "student", label: t.roleStudent }, { val: "teacher", label: t.roleTeacher }].map(r => (
                <button type="button" key={r.val} onClick={() => setForm({ ...form, role: r.val })}
                  className={`p-4 rounded-2xl font-black text-sm border-2 transition-all
                  ${form.role === r.val ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-600 hover:border-teal-200"}`}>
                  {r.label}
                </button>
              ))}
            </div>
          )}
          <button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:opacity-90 text-white p-5 rounded-2xl font-black text-xl transition shadow-lg">
            {isLogin ? t.signIn : t.createAccount}
          </button>
          <p onClick={() => setIsLogin(!isLogin)} className="text-center font-bold text-slate-400 cursor-pointer hover:text-teal-600 transition text-sm">
            {isLogin ? t.needAccount : t.alreadyAccount}
          </p>
        </form>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   TEACHER VIEW
═══════════════════════════════════════════════════════════════════════════ */
const TeacherView = ({ user }) => {
  const { t } = useLang();
  const [file, setFile] = useState(null);
  const [stats, setStats] = useState([]);
  const [lb, setLb] = useState([]);
  const [tab, setTab] = useState("upload");
  const [qImgs, setQImgs] = useState({ main: "", a: "", b: "", c: "", d: "" });
  const [upImg, setUpImg] = useState("");
  const [saving, setSaving] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [dueForm, setDueForm] = useState({ assignment_no: "", due_date: "" });
  const [dueMsg, setDueMsg] = useState("");
  // Sign of Day form
  const [sotd, setSotd] = useState({ word: "", description: "", image_url: "" });
  const [sotdImgLoading, setSotdImgLoading] = useState(false);
  // Dictionary form
  const [dictForm, setDictForm] = useState({ word: "", category: "Greetings", description: "", image_url: "" });
  const [dictImgLoading, setDictImgLoading] = useState(false);
  // Quiz form
  const [q, setQ] = useState({ assignment_no: 1, topic: "", text: "", opt_a: "", opt_b: "", opt_c: "", opt_d: "", correct_opt: "A", hint: "", difficulty: "medium" });

  useEffect(() => {
    axios.get(`${API}/teacher/stats`).then(r => setStats(r.data));
    axios.get(`${API}/teacher/leaderboard`).then(r => setLb(r.data));
    axios.get(`${API}/sessions`).then(r => setSessions(r.data));
    socket.on("new_stat", d => setStats(v => [d, ...v]));
    return () => socket.off("new_stat");
  }, []);

  const uploadImg = async (file, key, setter, loadSetter) => {
    loadSetter(key);
    const fd = new FormData(); fd.append("file", file);
    const r = await axios.post(`${API}/teacher/upload_image`, fd);
    setter(p => ({ ...p, [key]: r.data.url })); loadSetter("");
  };

  const uploadVideo = async () => {
    if (!file) return alert(t.selectVideoFile);
    setSaving(true);
    const fd = new FormData();
    fd.append("file", file); fd.append("title", q.topic); fd.append("assignment_no", q.assignment_no);
    if (q.due_date) fd.append("due_date", q.due_date);
    await axios.post(`${API}/teacher/upload`, fd);
    setSaving(false); alert(t.lessonSaved);
    axios.get(`${API}/sessions`).then(r => setSessions(r.data));
  };

  const addQuestion = async () => {
    if (!q.text || !q.opt_a || !q.opt_b || !q.opt_c || !q.opt_d) return alert(t.fillAllFields);
    await axios.post(`${API}/teacher/add_question`, { ...q, image_url: qImgs.main, img_a: qImgs.a, img_b: qImgs.b, img_c: qImgs.c, img_d: qImgs.d });
    setQImgs({ main: "", a: "", b: "", c: "", d: "" }); setQ({ ...q, text: "", opt_a: "", opt_b: "", opt_c: "", opt_d: "", hint: "" });
    alert(t.questionAdded);
  };

  const saveSignOfDay = async () => {
    if (!sotd.word || !sotd.description) return alert("Fill word and description");
    await axios.post(`${API}/teacher/sign_of_day`, { ...sotd, set_by: user.username });
    setSotd({ word: "", description: "", image_url: "" }); alert("🤟 Sign of the Day set!");
  };

  const saveDictEntry = async () => {
    if (!dictForm.word || !dictForm.image_url) return alert("Word and image are required");
    await axios.post(`${API}/teacher/dictionary`, dictForm);
    setDictForm({ word: "", category: "Greetings", description: "", image_url: "" }); alert("✅ Added to dictionary!");
  };

  const updateDueDate = async () => {
    if (!dueForm.assignment_no || !dueForm.due_date) return;
    await axios.post(`${API}/teacher/set_due_date`, dueForm);
    setDueMsg("✅ Updated!"); axios.get(`${API}/sessions`).then(r => setSessions(r.data));
    setTimeout(() => setDueMsg(""), 2500);
  };

  const TABS = [
    { k: "upload", l: t.uploadTab }, { k: "quiz", l: t.quizTab }, { k: "sotd", l: t.sotdTab },
    { k: "dict", l: t.dictTab }, { k: "schedule", l: t.scheduleTab },
    { k: "stats", l: t.statsTab }, { k: "leaderboard", l: t.leadersTab }, { k: "doubts", l: t.doubtsTab },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-500 px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-lg flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🤟</span>
          <span className="text-2xl font-black text-white">SignLearn</span>
          <span className="text-xs bg-white/20 text-white font-bold px-3 py-1 rounded-full">{t.teacher}</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <LangSwitcher />
          <span className="text-white/80 font-bold text-sm hidden sm:block">👋 {user.username}</span>
          <button onClick={() => { localStorage.clear(); window.location.href = "/" }}
            className="bg-white/20 hover:bg-white/30 text-white font-black px-4 py-2 rounded-2xl text-sm transition">
            {t.logout}
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b-2 border-slate-100 px-6 overflow-x-auto">
        <div className="flex gap-1 py-2 w-max">
          {TABS.map(tb => (
            <button key={tb.k} onClick={() => setTab(tb.k)}
              className={`px-4 py-2 rounded-xl font-black text-xs uppercase whitespace-nowrap transition
              ${tab === tb.k ? "bg-teal-500 text-white shadow" : "text-slate-500 hover:bg-slate-100"}`}>
              {tb.l}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* UPLOAD */}
        {tab === "upload" && (
          <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm max-w-lg space-y-4">
            <h2 className="font-black text-xl text-slate-800">{t.uploadLesson}</h2>
            <input type="number" className="w-full p-3 bg-slate-50 border-2 rounded-2xl font-bold focus:border-teal-400 outline-none"
              placeholder={t.assignmentNo} onChange={e => setQ({ ...q, assignment_no: e.target.value })} />
            <input className="w-full p-3 bg-slate-50 border-2 rounded-2xl font-bold focus:border-teal-400 outline-none"
              placeholder={t.lessonTopic} onChange={e => setQ({ ...q, topic: e.target.value })} />
            <div>
              <label className="text-xs font-black uppercase text-slate-400 tracking-wider">{t.dueDate}</label>
              <input type="datetime-local" className="w-full mt-1 p-3 bg-slate-50 border-2 rounded-2xl font-bold focus:border-teal-400 outline-none"
                onChange={e => setQ({ ...q, due_date: e.target.value })} />
            </div>
            <div className="border-4 border-dashed border-teal-200 rounded-3xl p-8 text-center bg-teal-50 cursor-pointer hover:bg-teal-100 transition">
              <input type="file" accept=".mp4,.webm" onChange={e => setFile(e.target.files[0])} className="hidden" id="vid-upload" />
              <label htmlFor="vid-upload" className="cursor-pointer">
                <p className="text-5xl mb-2">🎬</p>
                <p className="font-black text-teal-600">{file ? file.name : t.selectVideo}</p>
              </label>
            </div>
            <button onClick={uploadVideo} disabled={saving}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-4 rounded-2xl font-black disabled:opacity-50 transition text-lg">
              {saving ? t.saving : t.saveLesson}
            </button>
          </div>
        )}

        {/* QUIZ CREATOR */}
        {tab === "quiz" && (
          <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm max-w-2xl space-y-5">
            <h2 className="font-black text-xl">{t.addQuizQuestion}</h2>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" className="p-3 bg-slate-50 border-2 rounded-2xl font-bold focus:border-teal-400 outline-none"
                placeholder={t.assignmentNo} onChange={e => setQ({ ...q, assignment_no: e.target.value })} />
              <select className="p-3 bg-slate-50 border-2 rounded-2xl font-bold focus:border-teal-400 outline-none"
                value={q.difficulty} onChange={e => setQ({ ...q, difficulty: e.target.value })}>
                <option value="easy">{t.easy}</option><option value="medium">{t.medium}</option><option value="hard">{t.hard}</option>
              </select>
            </div>
            <textarea className="w-full p-3 bg-slate-50 border-2 rounded-2xl font-bold focus:border-teal-400 outline-none resize-none"
              rows={3} placeholder={t.questionText} value={q.text} onChange={e => setQ({ ...q, text: e.target.value })} />
            <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-4">
              <label className="text-xs font-black uppercase text-teal-600 tracking-wider">{t.questionImage}</label>
              <div className="flex items-center gap-3 mt-2">
                <input type="file" accept="image/*" onChange={e => uploadImg(e.target.files[0], "main", setQImgs, setUpImg)} className="text-xs text-slate-500 flex-1" />
                {upImg === "main" && <span className="text-xs text-teal-500 font-bold">{t.uploading}</span>}
                {qImgs.main && <img src={qImgs.main} className="w-16 h-16 rounded-xl object-cover border-2 border-teal-300" alt="" />}
              </div>
            </div>
            <input className="w-full p-3 bg-slate-50 border-2 rounded-2xl font-bold focus:border-teal-400 outline-none"
              placeholder={t.hint} value={q.hint} onChange={e => setQ({ ...q, hint: e.target.value })} />
            <div className="space-y-3">
              <label className="text-xs font-black uppercase text-slate-400">{t.answerOptions}</label>
              {["a", "b", "c", "d"].map(l => (
                <div key={l} className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-100">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-9 h-9 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center font-black">{l.toUpperCase()}</span>
                    <input className="flex-1 p-2 bg-white border-2 rounded-xl font-bold text-sm focus:border-teal-400 outline-none"
                      placeholder={`${t.optionText} ${l.toUpperCase()}`} value={q[`opt_${l}`]}
                      onChange={e => setQ({ ...q, [`opt_${l}`]: e.target.value })} />
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="file" accept="image/*" onChange={e => uploadImg(e.target.files[0], l, setQImgs, setUpImg)} className="text-xs text-slate-400 flex-1" />
                    {upImg === l && <span className="text-xs text-teal-500 font-bold">{t.uploading}</span>}
                    {qImgs[l] && <img src={qImgs[l]} className="w-12 h-12 rounded-lg object-cover border-2 border-teal-200" alt="" />}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
              <label className="text-xs font-black uppercase text-green-600">{t.correctAnswer}</label>
              <select className="w-full mt-2 p-3 bg-green-600 text-white rounded-xl font-black focus:outline-none"
                value={q.correct_opt} onChange={e => setQ({ ...q, correct_opt: e.target.value })}>
                {["A", "B", "C", "D"].map(o => <option key={o} value={o}>✅ Option {o}</option>)}
              </select>
            </div>
            <button onClick={addQuestion} className="w-full bg-slate-800 hover:bg-slate-900 text-white p-4 rounded-2xl font-black transition">{t.addQuestion}</button>
          </div>
        )}

        {/* SIGN OF THE DAY */}
        {tab === "sotd" && (
          <div className="max-w-lg space-y-5">
            <div className="bg-gradient-to-br from-teal-500 to-cyan-400 p-8 rounded-3xl text-white shadow-xl">
              <h2 className="font-black text-2xl mb-2">{t.setSignOfDay}</h2>
              <p className="text-white/70 text-sm">Students will see this on their home page every day 🌅</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 space-y-4 shadow-sm">
              <input className="w-full p-3 bg-slate-50 border-2 rounded-2xl font-bold focus:border-teal-400 outline-none"
                placeholder={t.signWord} value={sotd.word} onChange={e => setSotd({ ...sotd, word: e.target.value })} />
              <textarea className="w-full p-3 bg-slate-50 border-2 rounded-2xl font-bold focus:border-teal-400 outline-none resize-none" rows={3}
                placeholder={t.signDesc} value={sotd.description} onChange={e => setSotd({ ...sotd, description: e.target.value })} />
              <div>
                <label className="text-xs font-black uppercase text-slate-400">{t.addSignImage}</label>
                <div className="flex items-center gap-3 mt-2">
                  <input type="file" accept="image/*"
                    onChange={async e => {
                      setSotdImgLoading(true);
                      const fd = new FormData(); fd.append("file", e.target.files[0]);
                      const r = await axios.post(`${API}/teacher/upload_image`, fd);
                      setSotd(p => ({ ...p, image_url: r.data.url })); setSotdImgLoading(false);
                    }} className="text-xs text-slate-500 flex-1" />
                  {sotdImgLoading && <span className="text-xs text-teal-500 font-bold">{t.uploading}</span>}
                  {sotd.image_url && <img src={sotd.image_url} className="w-20 h-20 rounded-2xl object-cover border-4 border-teal-200" alt="" />}
                </div>
              </div>
              <button onClick={saveSignOfDay}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-4 rounded-2xl font-black text-lg transition hover:opacity-90">
                {t.saveSign}
              </button>
            </div>
          </div>
        )}

        {/* VISUAL DICTIONARY MANAGEMENT */}
        {tab === "dict" && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm max-w-lg space-y-4">
              <h2 className="font-black text-xl">{t.addToDictionary}</h2>
              <input className="w-full p-3 bg-slate-50 border-2 rounded-2xl font-bold focus:border-teal-400 outline-none"
                placeholder={t.dictWord} value={dictForm.word} onChange={e => setDictForm({ ...dictForm, word: e.target.value })} />
              <select className="w-full p-3 bg-slate-50 border-2 rounded-2xl font-bold focus:border-teal-400 outline-none"
                value={dictForm.category} onChange={e => setDictForm({ ...dictForm, category: e.target.value })}>
                {["Greetings", "Numbers", "Colors", "Animals", "Family", "Food", "Actions", "Emotions", "Objects"].map(c => <option key={c}>{c}</option>)}
              </select>
              <input className="w-full p-3 bg-slate-50 border-2 rounded-2xl font-bold focus:border-teal-400 outline-none"
                placeholder={t.dictDesc} value={dictForm.description} onChange={e => setDictForm({ ...dictForm, description: e.target.value })} />
              <div>
                <label className="text-xs font-black uppercase text-slate-400">{t.dictImage}</label>
                <div className="flex items-center gap-3 mt-2">
                  <input type="file" accept="image/*"
                    onChange={async e => {
                      setDictImgLoading(true);
                      const fd = new FormData(); fd.append("file", e.target.files[0]);
                      const r = await axios.post(`${API}/teacher/upload_image`, fd);
                      setDictForm(p => ({ ...p, image_url: r.data.url })); setDictImgLoading(false);
                    }} className="text-xs text-slate-500 flex-1" />
                  {dictImgLoading && <span className="text-xs text-teal-500 font-bold">{t.uploading}</span>}
                  {dictForm.image_url && <img src={dictForm.image_url} className="w-20 h-20 rounded-2xl object-cover border-4 border-teal-200" alt="" />}
                </div>
              </div>
              <button onClick={saveDictEntry}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-4 rounded-2xl font-black transition hover:opacity-90">
                {t.saveDictEntry}
              </button>
            </div>
            <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm">
              <h3 className="font-black text-xl mb-4">{t.visualDict}</h3>
              <DictionaryViewer />
            </div>
          </div>
        )}

        {/* SCHEDULE */}
        {tab === "schedule" && (
          <div className="max-w-2xl space-y-5">
            <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm space-y-4">
              <h2 className="font-black text-xl">{t.setDueDate}</h2>
              <select className="w-full p-3 bg-slate-50 border-2 rounded-2xl font-bold focus:border-teal-400 outline-none"
                value={dueForm.assignment_no} onChange={e => setDueForm({ ...dueForm, assignment_no: e.target.value })}>
                <option value="">— Select Assignment —</option>
                {sessions.map(s => <option key={s.id} value={s.ano}>Lesson {s.ano}: {s.title}</option>)}
              </select>
              <input type="datetime-local" className="w-full p-3 bg-slate-50 border-2 rounded-2xl font-bold focus:border-teal-400 outline-none"
                value={dueForm.due_date} onChange={e => setDueForm({ ...dueForm, due_date: e.target.value })} />
              <div className="flex items-center gap-3">
                <button onClick={updateDueDate} className="bg-teal-500 text-white px-6 py-3 rounded-2xl font-black hover:bg-teal-600 transition">{t.updateDue}</button>
                {dueMsg && <span className="text-green-600 font-bold">{dueMsg}</span>}
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm">
              <div className="space-y-3">
                {sessions.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                    <p className="font-black text-slate-800">Lesson {s.ano}: {s.title}</p>
                    <CountdownBadge dueDate={s.due_date} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STATS */}
        {tab === "stats" && (
          <div className="bg-slate-900 p-8 rounded-3xl text-white max-w-3xl">
            <h2 className="text-teal-400 font-black mb-6 uppercase text-xs tracking-widest">{t.liveProgress}</h2>
            {stats.length === 0
              ? <p className="text-slate-500 text-center py-10 font-bold">{t.noResults}</p>
              : <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {stats.map((s, i) => (
                  <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center">
                    <div>
                      <p className="text-xl font-black">{s.name}</p>
                      <p className="text-xs text-slate-400 font-bold uppercase">{s.topic}</p>
                      <p className="text-sm italic text-teal-300 mt-1">"{s.suggestion}"</p>
                      <div className="flex gap-3 mt-1 text-xs text-slate-500 font-bold">
                        {s.time_taken && <span>⏱ {Math.floor(s.time_taken / 60)}m {s.time_taken % 60}s</span>}
                        {s.attempt_no > 1 && <span>🔁 #{s.attempt_no}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-black">{s.score}%</p>
                      <p className={`text-xs font-bold uppercase ${s.score >= 70 ? "text-green-400" : "text-red-400"}`}>{s.prediction}</p>
                    </div>
                  </div>
                ))}
              </div>}
          </div>
        )}

        {/* LEADERBOARD */}
        {tab === "leaderboard" && (
          <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm max-w-2xl">
            <h2 className="font-black text-xl mb-6">{t.classLeaderboard}</h2>
            {lb.length === 0
              ? <p className="text-slate-400 text-center py-10 font-bold">{t.noData}</p>
              : <div className="space-y-3">
                {lb.map((s, i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border-2
                      ${i === 0 ? "border-yellow-300 bg-yellow-50" : i === 1 ? "border-slate-200 bg-slate-50" : i === 2 ? "border-orange-200 bg-orange-50" : "border-slate-100"}`}>
                    <span className="text-3xl w-10 text-center">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
                    <div className="flex-1">
                      <p className="font-black text-lg">{s.name}</p>
                      <p className="text-xs text-slate-500 font-bold">{s.quizzes_taken} {t.quizzesTaken}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-teal-600">{s.avg_score}%</p>
                      <p className="text-xs text-slate-400 font-bold">{t.best}: {s.best_score}%</p>
                    </div>
                  </div>
                ))}
              </div>}
          </div>
        )}

        {/* DOUBTS */}
        {tab === "doubts" && (
          <div className="max-w-2xl">
            <h2 className="font-black text-xl mb-4">{t.allDoubts}</h2>
            <DoubtBox ano={null} username={user.username} isTeacher={true} />
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   STUDENT VIEW
═══════════════════════════════════════════════════════════════════════════ */
const StudentView = ({ user }) => {
  const { t } = useLang();
  const [vids, setVids] = useState([]);
  const [activeQuiz, setAQ] = useState(null);
  const [tip, setTip] = useState(null);
  const [history, setHistory] = useState([]);
  const [bookmarks, setBM] = useState([]);
  const [badges, setBadges] = useState([]);
  const [allBadgeDefs, setAllBadgeDefs] = useState([]);
  const [tab, setTab] = useState("lessons");
  const [search, setSearch] = useState("");
  const [openDoubt, setOD] = useState(null);
  const [newBadgePopup, setNewBadgePopup] = useState(null);

  useEffect(() => {
    axios.get(`${API}/sessions`).then(r => setVids(r.data));
    axios.get(`${API}/student/history/${user.username}`).then(r => setHistory(r.data));
    axios.get(`${API}/student/bookmarks/${user.username}`).then(r => setBM(r.data.map(b => b.id)));
    axios.get(`${API}/student/badges/${user.username}`).then(r => setBadges(r.data));
    axios.get(`${API}/badges/all`).then(r => setAllBadgeDefs(r.data));
    socket.on("new_badge", ({ student, badge }) => {
      if (student === user.username) {
        setBadges(p => [...p, badge]);
        setNewBadgePopup(badge); setTimeout(() => setNewBadgePopup(null), 4000);
      }
    });
    return () => socket.off("new_badge");
  }, []);

  const toggleBM = async (id) => {
    const r = await axios.post(`${API}/student/bookmark`, { username: user.username, session_id: id });
    setBM(prev => r.data.bookmarked ? [...prev, id] : prev.filter(x => x !== id));
  };

  const filtered = vids.filter(v => v.title.toLowerCase().includes(search.toLowerCase()) || String(v.ano).includes(search));
  const avgScore = history.length > 0 ? Math.round(history.reduce((a, b) => a + b.score, 0) / history.length) : 0;
  const earnedKeys = new Set(badges.map(b => b.key));

  const TABS = [{ k: "lessons", l: t.lessonsTab }, { k: "history", l: t.historyTab }, { k: "badges", l: t.badgesTab }, { k: "dict", l: t.myDictTab }];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {activeQuiz && (
        <QuizOverlay user={user} topic={activeQuiz.title} ano={activeQuiz.ano}
          onClose={tip => { if (tip) setTip(tip); setAQ(null); axios.get(`${API}/student/history/${user.username}`).then(r => setHistory(r.data)); }} />
      )}

      {/* New badge popup */}
      {newBadgePopup && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] bg-amber-400 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="text-4xl">{newBadgePopup.emoji}</span>
          <div><p className="font-black text-lg">🎉 New Badge!</p><p className="font-bold">{newBadgePopup.label}</p></div>
        </div>
      )}

      {/* Top bar */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-500 px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-lg flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🤟</span>
          <h1 className="text-2xl font-black text-white">{t.myStudyRoom}</h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <LangSwitcher />
          <span className="text-white/80 text-sm font-bold hidden sm:block">👤 {user.username}</span>
          <button onClick={() => { localStorage.clear(); window.location.href = "/" }}
            className="bg-white/20 hover:bg-white/30 text-white font-black px-4 py-2 rounded-2xl text-sm transition">
            {t.logout}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6">
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: t.lessonsAvailable, value: vids.length, icon: "📹", color: "bg-teal-500" },
            { label: t.quizzesDone, value: history.length, icon: "✅", color: "bg-cyan-500" },
            { label: t.avgScore, value: `${avgScore}%`, icon: "⭐", color: "bg-amber-500" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-3xl p-4 shadow-sm border-2 border-slate-100 text-center">
              <div className={`${s.color} w-10 h-10 rounded-2xl flex items-center justify-center text-xl mx-auto mb-2`}>{s.icon}</div>
              <p className="text-2xl font-black text-slate-800">{s.value}</p>
              <p className="text-xs font-bold text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Sign of the Day */}
        <SignOfDayCard />

        {/* Teacher tip */}
        {tip && (
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-5 rounded-3xl text-white mb-5 flex items-start gap-4 shadow-lg">
            <span className="text-3xl">💡</span>
            <div className="flex-1">
              <p className="text-xs font-black uppercase opacity-70 mb-1">{t.teachersTip}</p>
              <p className="text-lg font-bold">{tip}</p>
            </div>
            <button onClick={() => setTip(null)} className="text-white/60 hover:text-white font-black">✕</button>
          </div>
        )}

        {/* Badge count teaser */}
        {badges.length > 0 && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-4 mb-5 flex items-center gap-4 cursor-pointer hover:bg-amber-100 transition"
            onClick={() => setTab("badges")}>
            <div className="flex gap-1">{badges.slice(0, 5).map(b => <span key={b.key} className="text-2xl">{b.emoji}</span>)}</div>
            <p className="font-black text-amber-700">{badges.length} badge{badges.length !== 1 ? "s" : ""} earned! 🎖️</p>
            <span className="ml-auto text-amber-400 font-black">→</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 bg-white p-1.5 rounded-2xl border-2 border-slate-100 w-fit mb-6 shadow-sm">
          {TABS.map(tb => (
            <button key={tb.k} onClick={() => setTab(tb.k)}
              className={`px-4 py-2 rounded-xl font-black text-xs uppercase transition
              ${tab === tb.k ? "bg-teal-500 text-white shadow" : "text-slate-500 hover:bg-slate-100"}`}>
              {tb.l}
            </button>
          ))}
        </div>

        {/* LESSONS TAB */}
        {tab === "lessons" && (
          <>
            <input className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl font-bold mb-5 focus:border-teal-400 outline-none shadow-sm"
              placeholder={t.searchLessons} value={search} onChange={e => setSearch(e.target.value)} />
            {filtered.length === 0
              ? <div className="text-center py-20"><p className="text-6xl mb-3">📭</p><p className="text-xl font-black text-slate-400">{search ? t.noSearchResults : t.noLessons}</p></div>
              : <div className="space-y-8 pb-10">
                {filtered.map((v, i) => (
                  <div key={i} className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg border-2 border-slate-100">
                    {/* Lesson header */}
                    <div className="p-5 flex justify-between items-center flex-wrap gap-4 bg-gradient-to-r from-teal-50 to-cyan-50 border-b-2 border-teal-100">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-md">
                          {v.ano}
                        </div>
                        <div>
                          <h2 className="text-xl font-black text-slate-800 uppercase">{v.title}</h2>
                          {v.description && <p className="text-sm text-slate-500">{v.description}</p>}
                          {v.due_date && <div className="mt-1"><CountdownBadge dueDate={v.due_date} /></div>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => toggleBM(v.id)}
                          className={`text-2xl p-2 rounded-xl transition hover:scale-110 ${bookmarks.includes(v.id) ? "text-amber-500" : "text-slate-300"}`}>
                          {bookmarks.includes(v.id) ? "🔖" : "📄"}
                        </button>
                        <button onClick={() => setAQ(v)}
                          className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:opacity-90 text-white px-6 py-3 rounded-2xl text-base font-black shadow-lg transition">
                          {t.startTest}
                        </button>
                      </div>
                    </div>

                    {/* Video */}
                    <div className="p-5 bg-slate-50">
                      <div className="bg-black rounded-3xl overflow-hidden border-8 border-white aspect-video shadow-inner">
                        <video controls className="w-full h-full" src={v.url} />
                      </div>
                      <p className="text-center mt-3 text-sm font-bold text-slate-400 uppercase tracking-wider">{t.watchThenQuiz}</p>
                    </div>

                    {/* Doubt Box */}
                    <div className="border-t-2 border-slate-100">
                      <button onClick={() => setOD(openDoubt === v.ano ? null : v.ano)}
                        className="w-full p-4 flex items-center justify-between hover:bg-teal-50 transition">
                        <span className="font-black text-teal-700">{t.doubtBox}</span>
                        <span className="text-teal-400">{openDoubt === v.ano ? "▲" : "▼"}</span>
                      </button>
                      {openDoubt === v.ano && (
                        <div className="p-5 pt-0"><DoubtBox ano={v.ano} username={user.username} isTeacher={false} /></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>}
          </>
        )}

        {/* HISTORY TAB */}
        {tab === "history" && (
          <div className="space-y-3 pb-10">
            {history.length === 0
              ? <div className="text-center py-20"><p className="text-6xl mb-3">📊</p><p className="text-xl font-black text-slate-400">{t.noHistory}</p></div>
              : history.map((h, i) => (
                <div key={i} className="bg-white p-5 rounded-3xl border-2 border-slate-100 shadow-sm flex justify-between items-center">
                  <div>
                    <p className="font-black text-lg text-slate-800">{h.topic}</p>
                    <p className="text-xs text-slate-400 font-bold">{h.created_at} · {t.attempt} #{h.attempt_no}</p>
                    <p className="text-sm italic text-teal-600 mt-1">{h.prediction}</p>
                  </div>
                  <div className={`text-3xl font-black ${h.score >= 70 ? "text-teal-600" : h.score >= 40 ? "text-amber-500" : "text-red-500"}`}>
                    {h.score}%
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* BADGES TAB */}
        {tab === "badges" && (
          <div className="pb-10">
            {badges.length === 0 && (
              <div className="text-center py-10 mb-6 bg-amber-50 border-2 border-amber-200 rounded-3xl">
                <p className="text-5xl mb-2">🎖️</p>
                <p className="font-black text-amber-600">{t.noBadges}</p>
              </div>
            )}
            {badges.length > 0 && (
              <div className="mb-8">
                <h3 className="font-black text-slate-700 mb-4 text-lg">{t.myBadges} ({badges.length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {badges.map(b => <BadgeCard key={b.key} badge={b} />)}
                </div>
              </div>
            )}
            <h3 className="font-black text-slate-500 mb-4 text-sm uppercase tracking-widest">{t.allBadges}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {allBadgeDefs.filter(b => !earnedKeys.has(b.key)).map(b => <BadgeCard key={b.key} badge={b} locked={true} />)}
            </div>
          </div>
        )}

        {/* SIGN DICTIONARY TAB */}
        {tab === "dict" && (
          <div className="pb-10">
            <h2 className="font-black text-2xl text-slate-800 mb-5">{t.visualDict}</h2>
            <DictionaryViewer />
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [auth, setAuth] = useState(() => {
    const s = localStorage.getItem("user"); return s ? JSON.parse(s) : { loggedIn: false };
  });
  return (
    <LangProvider>
      <Router>
        <Routes>
          <Route path="/" element={auth.loggedIn ? <Navigate to={`/${auth.role}`} /> : <Auth setAuth={setAuth} />} />
          <Route path="/teacher" element={auth.loggedIn && auth.role === "teacher" ? <TeacherView user={auth} /> : <Navigate to="/" />} />
          <Route path="/student" element={auth.loggedIn && auth.role === "student" ? <StudentView user={auth} /> : <Navigate to="/" />} />
        </Routes>
      </Router>
    </LangProvider>
  );
}