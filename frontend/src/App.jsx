import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");
const API = "http://localhost:5000";

/* ═══════════════════════════════════════════════════════════════════════════
   TRANSLATIONS
═══════════════════════════════════════════════════════════════════════════ */
const LANGS = {
  en: {
    code: "en",
    label: "English",
    flag: "🇬🇧",
    appName: "SignLearn",
    appTagline: "See · Learn · Sign",
    welcomeBack: "Welcome back",
    createAccount: "Create your account",
    username: "Your name",
    password: "Password",
    signIn: "Sign In",
    needAccount: "New here? Create account",
    alreadyAccount: "Already have an account? Sign in",
    accountCreated: "Account created. Please sign in.",
    invalidCreds: "Incorrect name or password.",
    roleStudent: "I am a Student",
    roleTeacher: "I am a Teacher",
    teacher: "Teacher",
    logout: "Sign out",
    uploadTab: "Lessons",
    quizTab: "Quiz",
    statsTab: "Progress",
    leadersTab: "Leaderboard",
    doubtsTab: "Questions",
    scheduleTab: "Schedule",
    dictTab: "Dictionary",
    sotdTab: "Sign of the Day",
    lessonsTab: "Lessons",
    historyTab: "My Progress",
    badgesTab: "Achievements",
    myDictTab: "Signs",
    uploadLesson: "Upload Lesson",
    assignmentNo: "Lesson Number",
    lessonTopic: "Lesson Topic",
    selectVideo: "Choose a video file (.mp4 or .webm)",
    saveLesson: "Save Lesson",
    saving: "Saving…",
    dueDate: "Quiz Due Date (optional)",
    addQuizQuestion: "Add Quiz Question",
    questionText: "Question",
    questionImage: "Sign Image (optional)",
    hint: "Hint for students (optional)",
    answerOptions: "Answer Choices",
    optionText: "Choice",
    correctAnswer: "Correct Answer",
    addQuestion: "Add Question",
    liveProgress: "Live Student Progress",
    noResults: "No quiz results yet",
    classLeaderboard: "Top Students",
    noData: "No results yet",
    quizzesTaken: "quizzes",
    best: "Best",
    uploading: "Uploading…",
    lessonSaved: "Lesson saved.",
    questionAdded: "Question added.",
    fillAllFields: "Please fill in all fields.",
    selectVideoFile: "Please choose a video file.",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    attempt: "Attempt",
    myStudyRoom: "My Learning Space",
    lessonsAvailable: "Lessons",
    quizzesDone: "Quizzes Done",
    avgScore: "Average Score",
    teachersTip: "Teacher's note:",
    searchLessons: "Search lessons…",
    noLessons: "No lessons yet. Check back soon.",
    noSearchResults: "No lessons found.",
    watchThenQuiz: "Watch the video, then take the quiz when you are ready.",
    startTest: "Take Quiz",
    noHistory: "No quizzes taken yet. Start learning.",
    loadingQuiz: "Loading quiz…",
    noQuestions: "No questions for this lesson yet.",
    goBack: "Go Back",
    assignment: "Lesson",
    previous: "Previous",
    next: "Next",
    submitTest: "Submit Answers",
    answerAll: "Please answer all questions.",
    remaining: "remaining",
    useHint: "Show Hint",
    hintLabel: "Hint:",
    backToLessons: "Back to Lessons",
    scoreBreakdown: "Your Answers",
    correctAnswer2: "Correct answer:",
    xpEarned: "XP",
    attemptNo: "Attempt",
    dueIn: "Due in",
    overdue: "Overdue",
    noDueDate: "No due date",
    daysLeft: "days",
    hoursLeft: "hours",
    minsLeft: "min",
    setDueDate: "Set Due Date",
    updateDue: "Update",
    doubtBox: "Ask a Question",
    askDoubt: "Have a question about this lesson?",
    doubtPlaceholder: "Type your question here…",
    submitDoubt: "Send Question",
    noDoubts: "No questions yet.",
    teacherAnswer: "Teacher's Answer",
    unanswered: "Awaiting teacher's response…",
    replyPlaceholder: "Type your answer…",
    sendReply: "Send Reply",
    allDoubts: "Student Questions",
    doubtFor: "Lesson",
    myBadges: "My Achievements",
    noBadges: "Keep learning to earn achievements.",
    earned: "Earned",
    allBadges: "All Achievements",
    locked: "Not yet earned",
    signOfDay: "Sign of the Day",
    todaysSign: "Today's Sign",
    setSignOfDay: "Set Today's Sign",
    signWord: "Sign word (e.g. Hello)",
    signDesc: "How to perform this sign…",
    addSignImage: "Add sign image",
    saveSign: "Set Today's Sign",
    visualDict: "Sign Dictionary",
    searchSigns: "Search signs…",
    allCategories: "All",
    addToDictionary: "Add New Sign",
    dictWord: "Sign Word",
    dictCategory: "Category",
    dictDesc: "Description (optional)",
    dictImage: "Sign Image",
    saveDictEntry: "Add to Dictionary",
    noDictEntries: "No signs in dictionary yet.",
  },
  hi: {
    code: "hi",
    label: "हिंदी",
    flag: "🇮🇳",
    appName: "SignLearn",
    appTagline: "देखें · सीखें · करें",
    welcomeBack: "वापस स्वागत है",
    createAccount: "खाता बनाएं",
    username: "आपका नाम",
    password: "पासवर्ड",
    signIn: "लॉगिन करें",
    needAccount: "नए हैं? खाता बनाएं",
    alreadyAccount: "पहले से खाता है? लॉगिन करें",
    accountCreated: "खाता बना। लॉगिन करें।",
    invalidCreds: "नाम या पासवर्ड गलत है।",
    roleStudent: "मैं छात्र हूँ",
    roleTeacher: "मैं शिक्षक हूँ",
    teacher: "शिक्षक",
    logout: "लॉगआउट",
    uploadTab: "पाठ",
    quizTab: "प्रश्नोत्तरी",
    statsTab: "प्रगति",
    leadersTab: "शीर्ष छात्र",
    doubtsTab: "प्रश्न",
    scheduleTab: "समय-सारणी",
    dictTab: "शब्दकोश",
    sotdTab: "आज का संकेत",
    lessonsTab: "पाठ",
    historyTab: "मेरी प्रगति",
    badgesTab: "उपलब्धियां",
    myDictTab: "संकेत",
    uploadLesson: "पाठ अपलोड करें",
    assignmentNo: "पाठ क्रमांक",
    lessonTopic: "पाठ का विषय",
    selectVideo: "वीडियो चुनें (.mp4 या .webm)",
    saveLesson: "पाठ सहेजें",
    saving: "सहेजा जा रहा है…",
    dueDate: "नियत तारीख (वैकल्पिक)",
    addQuizQuestion: "प्रश्न जोड़ें",
    questionText: "प्रश्न",
    questionImage: "संकेत की छवि (वैकल्पिक)",
    hint: "संकेत (वैकल्पिक)",
    answerOptions: "उत्तर के विकल्प",
    optionText: "विकल्प",
    correctAnswer: "सही उत्तर",
    addQuestion: "प्रश्न जोड़ें",
    liveProgress: "छात्रों की लाइव प्रगति",
    noResults: "अभी कोई परिणाम नहीं",
    classLeaderboard: "शीर्ष छात्र",
    noData: "अभी कोई डेटा नहीं",
    quizzesTaken: "प्रश्नोत्तरी",
    best: "सर्वश्रेष्ठ",
    uploading: "अपलोड हो रहा है…",
    lessonSaved: "पाठ सहेजा।",
    questionAdded: "प्रश्न जोड़ा।",
    fillAllFields: "सभी फ़ील्ड भरें।",
    selectVideoFile: "वीडियो फ़ाइल चुनें।",
    easy: "आसान",
    medium: "मध्यम",
    hard: "कठिन",
    attempt: "प्रयास",
    myStudyRoom: "मेरी अध्ययन स्थान",
    lessonsAvailable: "पाठ",
    quizzesDone: "प्रश्नोत्तरी",
    avgScore: "औसत अंक",
    teachersTip: "शिक्षक की टिप्पणी:",
    searchLessons: "पाठ खोजें…",
    noLessons: "अभी कोई पाठ नहीं।",
    noSearchResults: "कोई पाठ नहीं मिला।",
    watchThenQuiz: "पहले वीडियो देखें, फिर प्रश्नोत्तरी दें।",
    startTest: "प्रश्नोत्तरी दें",
    noHistory: "अभी कोई प्रश्नोत्तरी नहीं।",
    loadingQuiz: "लोड हो रहा है…",
    noQuestions: "इस पाठ के लिए अभी प्रश्न नहीं।",
    goBack: "वापस जाएं",
    assignment: "पाठ",
    previous: "पिछला",
    next: "अगला",
    submitTest: "उत्तर जमा करें",
    answerAll: "सभी प्रश्नों के उत्तर दें।",
    remaining: "बाकी",
    useHint: "संकेत दिखाएं",
    hintLabel: "संकेत:",
    backToLessons: "पाठों पर वापस",
    scoreBreakdown: "आपके उत्तर",
    correctAnswer2: "सही उत्तर:",
    xpEarned: "XP",
    attemptNo: "प्रयास",
    dueIn: "में समय सीमा",
    overdue: "समय सीमा पार",
    noDueDate: "कोई समय सीमा नहीं",
    daysLeft: "दिन",
    hoursLeft: "घंटे",
    minsLeft: "मिनट",
    setDueDate: "नियत तारीख सेट करें",
    updateDue: "अपडेट करें",
    doubtBox: "प्रश्न पूछें",
    askDoubt: "इस पाठ के बारे में कोई प्रश्न?",
    doubtPlaceholder: "यहाँ अपना प्रश्न लिखें…",
    submitDoubt: "प्रश्न भेजें",
    noDoubts: "अभी कोई प्रश्न नहीं।",
    teacherAnswer: "शिक्षक का उत्तर",
    unanswered: "शिक्षक का उत्तर आने वाला है…",
    replyPlaceholder: "अपना उत्तर लिखें…",
    sendReply: "उत्तर भेजें",
    allDoubts: "छात्रों के प्रश्न",
    doubtFor: "पाठ",
    myBadges: "मेरी उपलब्धियां",
    noBadges: "उपलब्धियां पाने के लिए पढ़ते रहें।",
    earned: "मिला",
    allBadges: "सभी उपलब्धियां",
    locked: "अभी नहीं मिला",
    signOfDay: "आज का संकेत",
    todaysSign: "आज का संकेत",
    setSignOfDay: "आज का संकेत सेट करें",
    signWord: "संकेत शब्द (जैसे: नमस्ते)",
    signDesc: "यह संकेत कैसे करें…",
    addSignImage: "संकेत की छवि जोड़ें",
    saveSign: "आज का संकेत सेट करें",
    visualDict: "संकेत शब्दकोश",
    searchSigns: "संकेत खोजें…",
    allCategories: "सभी",
    addToDictionary: "नया संकेत जोड़ें",
    dictWord: "संकेत शब्द",
    dictCategory: "श्रेणी",
    dictDesc: "विवरण (वैकल्पिक)",
    dictImage: "संकेत छवि",
    saveDictEntry: "शब्दकोश में जोड़ें",
    noDictEntries: "शब्दकोश में अभी कोई संकेत नहीं।",
  },
  mr: {
    code: "mr",
    label: "मराठी",
    flag: "🇮🇳",
    appName: "SignLearn",
    appTagline: "पहा · शिका · करा",
    welcomeBack: "परत स्वागत",
    createAccount: "खाते तयार करा",
    username: "तुमचे नाव",
    password: "पासवर्ड",
    signIn: "लॉगिन करा",
    needAccount: "नवीन आहात? खाते तयार करा",
    alreadyAccount: "आधीच खाते आहे? लॉगिन करा",
    accountCreated: "खाते तयार. लॉगिन करा.",
    invalidCreds: "नाव किंवा पासवर्ड चुकीचे.",
    roleStudent: "मी विद्यार्थी आहे",
    roleTeacher: "मी शिक्षक आहे",
    teacher: "शिक्षक",
    logout: "लॉगआउट",
    uploadTab: "धडे",
    quizTab: "प्रश्नमंजुषा",
    statsTab: "प्रगती",
    leadersTab: "अव्वल विद्यार्थी",
    doubtsTab: "प्रश्न",
    scheduleTab: "वेळापत्रक",
    dictTab: "शब्दकोश",
    sotdTab: "आजची खूण",
    lessonsTab: "धडे",
    historyTab: "माझी प्रगती",
    badgesTab: "उपलब्धी",
    myDictTab: "खुणा",
    uploadLesson: "धडा अपलोड करा",
    assignmentNo: "धडा क्रमांक",
    lessonTopic: "धड्याचा विषय",
    selectVideo: "व्हिडिओ निवडा (.mp4 किंवा .webm)",
    saveLesson: "धडा जतन करा",
    saving: "जतन होत आहे…",
    dueDate: "अंतिम तारीख (पर्यायी)",
    addQuizQuestion: "प्रश्न जोडा",
    questionText: "प्रश्न",
    questionImage: "खुणेचा फोटो (पर्यायी)",
    hint: "संकेत (पर्यायी)",
    answerOptions: "उत्तराचे पर्याय",
    optionText: "पर्याय",
    correctAnswer: "बरोबर उत्तर",
    addQuestion: "प्रश्न जोडा",
    liveProgress: "विद्यार्थ्यांची थेट प्रगती",
    noResults: "अजून निकाल नाहीत",
    classLeaderboard: "अव्वल विद्यार्थी",
    noData: "अजून डेटा नाही",
    quizzesTaken: "प्रश्नमंजुषा",
    best: "सर्वोत्तम",
    uploading: "अपलोड होत आहे…",
    lessonSaved: "धडा जतन.",
    questionAdded: "प्रश्न जोडला.",
    fillAllFields: "सर्व फील्ड भरा.",
    selectVideoFile: "व्हिडिओ फाइल निवडा.",
    easy: "सोपे",
    medium: "मध्यम",
    hard: "कठीण",
    attempt: "प्रयत्न",
    myStudyRoom: "माझी अभ्यासिका",
    lessonsAvailable: "धडे",
    quizzesDone: "प्रश्नमंजुषा",
    avgScore: "सरासरी गुण",
    teachersTip: "शिक्षकांची टिप्पणी:",
    searchLessons: "धडे शोधा…",
    noLessons: "अजून धडे नाहीत.",
    noSearchResults: "कोणताही धडा सापडला नाही.",
    watchThenQuiz: "आधी व्हिडिओ पहा, मग प्रश्नमंजुषा द्या.",
    startTest: "प्रश्नमंजुषा द्या",
    noHistory: "अजून प्रश्नमंजुषा नाही.",
    loadingQuiz: "लोड होत आहे…",
    noQuestions: "या धड्यासाठी अजून प्रश्न नाहीत.",
    goBack: "मागे जा",
    assignment: "धडा",
    previous: "मागील",
    next: "पुढील",
    submitTest: "उत्तरे सादर करा",
    answerAll: "सर्व प्रश्नांची उत्तरे द्या.",
    remaining: "बाकी",
    useHint: "संकेत दाखवा",
    hintLabel: "संकेत:",
    backToLessons: "धड्यांकडे परत",
    scoreBreakdown: "तुमची उत्तरे",
    correctAnswer2: "बरोबर उत्तर:",
    xpEarned: "XP",
    attemptNo: "प्रयत्न",
    dueIn: "मध्ये अंतिम मुदत",
    overdue: "मुदत संपली",
    noDueDate: "अंतिम तारीख नाही",
    daysLeft: "दिवस",
    hoursLeft: "तास",
    minsLeft: "मिनिटे",
    setDueDate: "अंतिम तारीख सेट करा",
    updateDue: "अपडेट करा",
    doubtBox: "प्रश्न विचारा",
    askDoubt: "या धड्याबद्दल काही प्रश्न?",
    doubtPlaceholder: "इथे तुमचा प्रश्न लिहा…",
    submitDoubt: "प्रश्न पाठवा",
    noDoubts: "अजून प्रश्न नाहीत.",
    teacherAnswer: "शिक्षकांचे उत्तर",
    unanswered: "शिक्षकांचे उत्तर येईल…",
    replyPlaceholder: "तुमचे उत्तर लिहा…",
    sendReply: "उत्तर पाठवा",
    allDoubts: "विद्यार्थ्यांचे प्रश्न",
    doubtFor: "धडा",
    myBadges: "माझ्या उपलब्धी",
    noBadges: "उपलब्धी मिळवण्यासाठी शिकत राहा.",
    earned: "मिळाले",
    allBadges: "सर्व उपलब्धी",
    locked: "अजून मिळाले नाही",
    signOfDay: "आजची खूण",
    todaysSign: "आजची खूण",
    setSignOfDay: "आजची खूण सेट करा",
    signWord: "खुणेचा शब्द (उदा: नमस्कार)",
    signDesc: "ही खूण कशी करायची…",
    addSignImage: "खुणेचा फोटो जोडा",
    saveSign: "आजची खूण सेट करा",
    visualDict: "खुणांचा शब्दकोश",
    searchSigns: "खूण शोधा…",
    allCategories: "सर्व",
    addToDictionary: "नवीन खूण जोडा",
    dictWord: "खुणेचा शब्द",
    dictCategory: "श्रेणी",
    dictDesc: "वर्णन (पर्यायी)",
    dictImage: "खुणेचा फोटो",
    saveDictEntry: "शब्दकोशात जोडा",
    
    code: "en", label: "English", flag: "🇬🇧",
    appName: "SignLearn", appTagline: "See · Learn · Sign",
    welcomeBack: "Welcome back", createAccount: "Create your account",
    username: "Your name", password: "Password", signIn: "Sign In",
    needAccount: "New here? Create account", alreadyAccount: "Already have an account? Sign in",
    accountCreated: "Account created. Please sign in.", invalidCreds: "Incorrect name or password.",
    roleStudent: "I am a Student", roleTeacher: "I am a Teacher",
    teacher: "Teacher", logout: "Sign out",
    uploadTab: "Lessons", quizTab: "Quiz", statsTab: "Progress",
    leadersTab: "Leaderboard", doubtsTab: "Questions", scheduleTab: "Schedule",
    dictTab: "Dictionary", sotdTab: "Sign of the Day",
    lessonsTab: "Lessons", historyTab: "My Progress", badgesTab: "Achievements", myDictTab: "Signs",
    uploadLesson: "Upload Lesson", assignmentNo: "Lesson Number",
    lessonTopic: "Lesson Topic", selectVideo: "Choose a video file (.mp4 or .webm)",
    saveLesson: "Save Lesson", saving: "Saving…", dueDate: "Quiz Due Date (optional)",
    addQuizQuestion: "Add Quiz Question", questionText: "Question",
    questionImage: "Sign Image (optional)", hint: "Hint for students (optional)",
    answerOptions: "Answer Choices", optionText: "Choice",
    correctAnswer: "Correct Answer", addQuestion: "Add Question",
    liveProgress: "Live Student Progress", noResults: "No quiz results yet",
    classLeaderboard: "Top Students", noData: "No results yet",
    quizzesTaken: "quizzes", best: "Best", uploading: "Uploading…",
    lessonSaved: "Lesson saved.", questionAdded: "Question added.",
    fillAllFields: "Please fill in all fields.", selectVideoFile: "Please choose a video file.",
    easy: "Easy", medium: "Medium", hard: "Hard", attempt: "Attempt",
    myStudyRoom: "My Learning Space", lessonsAvailable: "Lessons", quizzesDone: "Quizzes Done",
    avgScore: "Average Score", teachersTip: "Teacher's note:",
    searchLessons: "Search lessons…", noLessons: "No lessons yet. Check back soon.",
    noSearchResults: "No lessons found.",
    watchThenQuiz: "Watch the video, then take the quiz when you are ready.",
    startTest: "Take Quiz", noHistory: "No quizzes taken yet. Start learning.",
    loadingQuiz: "Loading quiz…", noQuestions: "No questions for this lesson yet.",
    goBack: "Go Back", assignment: "Lesson", previous: "Previous", next: "Next",
    submitTest: "Submit Answers", answerAll: "Please answer all questions.",
    remaining: "remaining", useHint: "Show Hint", hintLabel: "Hint:",
    backToLessons: "Back to Lessons", scoreBreakdown: "Your Answers",
    correctAnswer2: "Correct answer:", xpEarned: "XP", attemptNo: "Attempt",
    dueIn: "Due in", overdue: "Overdue", noDueDate: "No due date",
    daysLeft: "days", hoursLeft: "hours", minsLeft: "min",
    setDueDate: "Set Due Date", updateDue: "Update",
    doubtBox: "Ask a Question", askDoubt: "Have a question about this lesson?",
    doubtPlaceholder: "Type your question here…",
    submitDoubt: "Send Question", noDoubts: "No questions yet.",
    teacherAnswer: "Teacher's Answer", unanswered: "Awaiting teacher's response…",
    replyPlaceholder: "Type your answer…", sendReply: "Send Reply",
    allDoubts: "Student Questions", doubtFor: "Lesson",
    myBadges: "My Achievements", noBadges: "Keep learning to earn achievements.",
    earned: "Earned", allBadges: "All Achievements", locked: "Not yet earned",
    signOfDay: "Sign of the Day", todaysSign: "Today's Sign",
    setSignOfDay: "Set Today's Sign", signWord: "Sign word (e.g. Hello)",
    signDesc: "How to perform this sign…", addSignImage: "Add sign image",
    saveSign: "Set Today's Sign",
    visualDict: "Sign Dictionary", searchSigns: "Search signs…",
    allCategories: "All", addToDictionary: "Add New Sign",
    dictWord: "Sign Word", dictCategory: "Category", dictDesc: "Description (optional)",
    dictImage: "Sign Image", saveDictEntry: "Add to Dictionary",
    noDictEntries: "No signs in dictionary yet.",
  },
  hi: {
    code: "hi", label: "हिंदी", flag: "🇮🇳",
    appName: "SignLearn", appTagline: "देखें · सीखें · करें",
    welcomeBack: "वापस स्वागत है", createAccount: "खाता बनाएं",
    username: "आपका नाम", password: "पासवर्ड", signIn: "लॉगिन करें",
    needAccount: "नए हैं? खाता बनाएं", alreadyAccount: "पहले से खाता है? लॉगिन करें",
    accountCreated: "खाता बना। लॉगिन करें।", invalidCreds: "नाम या पासवर्ड गलत है।",
    roleStudent: "मैं छात्र हूँ", roleTeacher: "मैं शिक्षक हूँ",
    teacher: "शिक्षक", logout: "लॉगआउट",
    uploadTab: "पाठ", quizTab: "प्रश्नोत्तरी", statsTab: "प्रगति",
    leadersTab: "शीर्ष छात्र", doubtsTab: "प्रश्न", scheduleTab: "समय-सारणी",
    dictTab: "शब्दकोश", sotdTab: "आज का संकेत",
    lessonsTab: "पाठ", historyTab: "मेरी प्रगति", badgesTab: "उपलब्धियां", myDictTab: "संकेत",
    uploadLesson: "पाठ अपलोड करें", assignmentNo: "पाठ क्रमांक",
    lessonTopic: "पाठ का विषय", selectVideo: "वीडियो चुनें (.mp4 या .webm)",
    saveLesson: "पाठ सहेजें", saving: "सहेजा जा रहा है…", dueDate: "नियत तारीख (वैकल्पिक)",
    addQuizQuestion: "प्रश्न जोड़ें", questionText: "प्रश्न",
    questionImage: "संकेत की छवि (वैकल्पिक)", hint: "संकेत (वैकल्पिक)",
    answerOptions: "उत्तर के विकल्प", optionText: "विकल्प",
    correctAnswer: "सही उत्तर", addQuestion: "प्रश्न जोड़ें",
    liveProgress: "छात्रों की लाइव प्रगति", noResults: "अभी कोई परिणाम नहीं",
    classLeaderboard: "शीर्ष छात्र", noData: "अभी कोई डेटा नहीं",
    quizzesTaken: "प्रश्नोत्तरी", best: "सर्वश्रेष्ठ", uploading: "अपलोड हो रहा है…",
    lessonSaved: "पाठ सहेजा।", questionAdded: "प्रश्न जोड़ा।",
    fillAllFields: "सभी फ़ील्ड भरें।", selectVideoFile: "वीडियो फ़ाइल चुनें।",
    easy: "आसान", medium: "मध्यम", hard: "कठिन", attempt: "प्रयास",
    myStudyRoom: "मेरी अध्ययन स्थान", lessonsAvailable: "पाठ", quizzesDone: "प्रश्नोत्तरी",
    avgScore: "औसत अंक", teachersTip: "शिक्षक की टिप्पणी:",
    searchLessons: "पाठ खोजें…", noLessons: "अभी कोई पाठ नहीं।",
    noSearchResults: "कोई पाठ नहीं मिला।", watchThenQuiz: "पहले वीडियो देखें, फिर प्रश्नोत्तरी दें।",
    startTest: "प्रश्नोत्तरी दें", noHistory: "अभी कोई प्रश्नोत्तरी नहीं।",
    loadingQuiz: "लोड हो रहा है…", noQuestions: "इस पाठ के लिए अभी प्रश्न नहीं।",
    goBack: "वापस जाएं", assignment: "पाठ", previous: "पिछला", next: "अगला",
    submitTest: "उत्तर जमा करें", answerAll: "सभी प्रश्नों के उत्तर दें।",
    remaining: "बाकी", useHint: "संकेत दिखाएं", hintLabel: "संकेत:",
    backToLessons: "पाठों पर वापस", scoreBreakdown: "आपके उत्तर",
    correctAnswer2: "सही उत्तर:", xpEarned: "XP", attemptNo: "प्रयास",
    dueIn: "में समय सीमा", overdue: "समय सीमा पार", noDueDate: "कोई समय सीमा नहीं",
    daysLeft: "दिन", hoursLeft: "घंटे", minsLeft: "मिनट",
    setDueDate: "नियत तारीख सेट करें", updateDue: "अपडेट करें",
    doubtBox: "प्रश्न पूछें", askDoubt: "इस पाठ के बारे में कोई प्रश्न?",
    doubtPlaceholder: "यहाँ अपना प्रश्न लिखें…",
    submitDoubt: "प्रश्न भेजें", noDoubts: "अभी कोई प्रश्न नहीं।",
    teacherAnswer: "शिक्षक का उत्तर", unanswered: "शिक्षक का उत्तर आने वाला है…",
    replyPlaceholder: "अपना उत्तर लिखें…", sendReply: "उत्तर भेजें",
    allDoubts: "छात्रों के प्रश्न", doubtFor: "पाठ",
    myBadges: "मेरी उपलब्धियां", noBadges: "उपलब्धियां पाने के लिए पढ़ते रहें।",
    earned: "मिला", allBadges: "सभी उपलब्धियां", locked: "अभी नहीं मिला",
    signOfDay: "आज का संकेत", todaysSign: "आज का संकेत",
    setSignOfDay: "आज का संकेत सेट करें", signWord: "संकेत शब्द (जैसे: नमस्ते)",
    signDesc: "यह संकेत कैसे करें…", addSignImage: "संकेत की छवि जोड़ें",
    saveSign: "आज का संकेत सेट करें",
    visualDict: "संकेत शब्दकोश", searchSigns: "संकेत खोजें…",
    allCategories: "सभी", addToDictionary: "नया संकेत जोड़ें",
    dictWord: "संकेत शब्द", dictCategory: "श्रेणी", dictDesc: "विवरण (वैकल्पिक)",
    dictImage: "संकेत छवि", saveDictEntry: "शब्दकोश में जोड़ें",
    noDictEntries: "शब्दकोश में अभी कोई संकेत नहीं।",
  },
  mr: {
    code: "mr", label: "मराठी", flag: "🇮🇳",
    appName: "SignLearn", appTagline: "पहा · शिका · करा",
    welcomeBack: "परत स्वागत", createAccount: "खाते तयार करा",
    username: "तुमचे नाव", password: "पासवर्ड", signIn: "लॉगिन करा",
    needAccount: "नवीन आहात? खाते तयार करा", alreadyAccount: "आधीच खाते आहे? लॉगिन करा",
    accountCreated: "खाते तयार. लॉगिन करा.", invalidCreds: "नाव किंवा पासवर्ड चुकीचे.",
    roleStudent: "मी विद्यार्थी आहे", roleTeacher: "मी शिक्षक आहे",
    teacher: "शिक्षक", logout: "लॉगआउट",
    uploadTab: "धडे", quizTab: "प्रश्नमंजुषा", statsTab: "प्रगती",
    leadersTab: "अव्वल विद्यार्थी", doubtsTab: "प्रश्न", scheduleTab: "वेळापत्रक",
    dictTab: "शब्दकोश", sotdTab: "आजची खूण",
    lessonsTab: "धडे", historyTab: "माझी प्रगती", badgesTab: "उपलब्धी", myDictTab: "खुणा",
    uploadLesson: "धडा अपलोड करा", assignmentNo: "धडा क्रमांक",
    lessonTopic: "धड्याचा विषय", selectVideo: "व्हिडिओ निवडा (.mp4 किंवा .webm)",
    saveLesson: "धडा जतन करा", saving: "जतन होत आहे…", dueDate: "अंतिम तारीख (पर्यायी)",
    addQuizQuestion: "प्रश्न जोडा", questionText: "प्रश्न",
    questionImage: "खुणेचा फोटो (पर्यायी)", hint: "संकेत (पर्यायी)",
    answerOptions: "उत्तराचे पर्याय", optionText: "पर्याय",
    correctAnswer: "बरोबर उत्तर", addQuestion: "प्रश्न जोडा",
    liveProgress: "विद्यार्थ्यांची थेट प्रगती", noResults: "अजून निकाल नाहीत",
    classLeaderboard: "अव्वल विद्यार्थी", noData: "अजून डेटा नाही",
    quizzesTaken: "प्रश्नमंजुषा", best: "सर्वोत्तम", uploading: "अपलोड होत आहे…",
    lessonSaved: "धडा जतन.", questionAdded: "प्रश्न जोडला.",
    fillAllFields: "सर्व फील्ड भरा.", selectVideoFile: "व्हिडिओ फाइल निवडा.",
    easy: "सोपे", medium: "मध्यम", hard: "कठीण", attempt: "प्रयत्न",
    myStudyRoom: "माझी अभ्यासिका", lessonsAvailable: "धडे", quizzesDone: "प्रश्नमंजुषा",
    avgScore: "सरासरी गुण", teachersTip: "शिक्षकांची टिप्पणी:",
    searchLessons: "धडे शोधा…", noLessons: "अजून धडे नाहीत.",
    noSearchResults: "कोणताही धडा सापडला नाही.", watchThenQuiz: "आधी व्हिडिओ पहा, मग प्रश्नमंजुषा द्या.",
    startTest: "प्रश्नमंजुषा द्या", noHistory: "अजून प्रश्नमंजुषा नाही.",
    loadingQuiz: "लोड होत आहे…", noQuestions: "या धड्यासाठी अजून प्रश्न नाहीत.",
    goBack: "मागे जा", assignment: "धडा", previous: "मागील", next: "पुढील",
    submitTest: "उत्तरे सादर करा", answerAll: "सर्व प्रश्नांची उत्तरे द्या.",
    remaining: "बाकी", useHint: "संकेत दाखवा", hintLabel: "संकेत:",
    backToLessons: "धड्यांकडे परत", scoreBreakdown: "तुमची उत्तरे",
    correctAnswer2: "बरोबर उत्तर:", xpEarned: "XP", attemptNo: "प्रयत्न",
    dueIn: "मध्ये अंतिम मुदत", overdue: "मुदत संपली", noDueDate: "अंतिम तारीख नाही",
    daysLeft: "दिवस", hoursLeft: "तास", minsLeft: "मिनिटे",
    setDueDate: "अंतिम तारीख सेट करा", updateDue: "अपडेट करा",
    doubtBox: "प्रश्न विचारा", askDoubt: "या धड्याबद्दल काही प्रश्न?",
    doubtPlaceholder: "इथे तुमचा प्रश्न लिहा…",
    submitDoubt: "प्रश्न पाठवा", noDoubts: "अजून प्रश्न नाहीत.",
    teacherAnswer: "शिक्षकांचे उत्तर", unanswered: "शिक्षकांचे उत्तर येईल…",
    replyPlaceholder: "तुमचे उत्तर लिहा…", sendReply: "उत्तर पाठवा",
    allDoubts: "विद्यार्थ्यांचे प्रश्न", doubtFor: "धडा",
    myBadges: "माझ्या उपलब्धी", noBadges: "उपलब्धी मिळवण्यासाठी शिकत राहा.",
    earned: "मिळाले", allBadges: "सर्व उपलब्धी", locked: "अजून मिळाले नाही",
    signOfDay: "आजची खूण", todaysSign: "आजची खूण",
    setSignOfDay: "आजची खूण सेट करा", signWord: "खुणेचा शब्द (उदा: नमस्कार)",
    signDesc: "ही खूण कशी करायची…", addSignImage: "खुणेचा फोटो जोडा",
    saveSign: "आजची खूण सेट करा",
    visualDict: "खुणांचा शब्दकोश", searchSigns: "खूण शोधा…",
    allCategories: "सर्व", addToDictionary: "नवीन खूण जोडा",
    dictWord: "खुणेचा शब्द", dictCategory: "श्रेणी", dictDesc: "वर्णन (पर्यायी)",
    dictImage: "खुणेचा फोटो", saveDictEntry: "शब्दकोशात जोडा",

    noDictEntries: "शब्दकोशात अजून खुणा नाहीत.",
  },
};

const LangContext = createContext();
const useLang = () => useContext(LangContext);
const LangProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  const t = LANGS[lang];
  const switchLang = (code) => {
    setLang(code);
    localStorage.setItem("lang", code);
  };
  return (
    <LangContext.Provider value={{ lang, t, switchLang, LANGS }}>
      {children}
    </LangContext.Provider>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS (injected as style tag)
═══════════════════════════════════════════════════════════════════════════ */
const DesignSystem = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

    :root {
      --cream: #FAF8F4;
      --cream-dark: #F0EDE6;
      --stone-100: #EDE9E2;
      --stone-200: #D9D3C8;
      --stone-300: #BCB5A7;
      --stone-500: #8B8073;
      --stone-700: #5C5248;
      --stone-900: #2D2821;
      --sage: #5C7A6A;
      --sage-light: #EBF2EE;
      --sage-mid: #A8C4B5;
      --sage-dark: #3D5C4E;
      --amber: #C4874A;
      --amber-light: #F5EDE0;
      --sky: #4A7A9B;
      --sky-light: #E8F0F5;
      --rose: #B05C5C;
      --rose-light: #F5ECEC;
      --font-serif: 'DM Serif Display', Georgia, serif;
      --font-sans: 'DM Sans', system-ui, sans-serif;
      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 20px;
      --radius-xl: 28px;
      --shadow-sm: 0 1px 3px rgba(45,40,33,0.08), 0 1px 2px rgba(45,40,33,0.04);
      --shadow-md: 0 4px 16px rgba(45,40,33,0.10), 0 2px 6px rgba(45,40,33,0.06);
      --shadow-lg: 0 12px 40px rgba(45,40,33,0.12), 0 4px 12px rgba(45,40,33,0.08);
    }

    *, *::before, *::after { box-sizing: border-box; }

    body {
      font-family: var(--font-sans);
      background: var(--cream);
      color: var(--stone-900);
      -webkit-font-smoothing: antialiased;
      line-height: 1.6;
    }

    /* Accessible focus ring */
    :focus-visible {
      outline: 3px solid var(--sage);
      outline-offset: 3px;
      border-radius: var(--radius-sm);
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: var(--cream-dark); }
    ::-webkit-scrollbar-thumb { background: var(--stone-200); border-radius: 99px; }

    /* Typography scale */
    .sl-display { font-family: var(--font-serif); font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.1; letter-spacing: -0.02em; color: var(--stone-900); }
    .sl-heading { font-family: var(--font-serif); font-size: clamp(1.3rem, 3vw, 2rem); line-height: 1.2; color: var(--stone-900); }
    .sl-subheading { font-family: var(--font-sans); font-size: 1.1rem; font-weight: 500; color: var(--stone-700); }
    .sl-label { font-family: var(--font-sans); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--stone-500); }
    .sl-body { font-family: var(--font-sans); font-size: 1rem; color: var(--stone-700); line-height: 1.7; }
    .sl-body-lg { font-size: 1.125rem; }

    /* Layout containers */
    .sl-page { min-height: 100vh; background: var(--cream); }
    .sl-container { max-width: 960px; margin: 0 auto; padding: 0 1.5rem; }
    .sl-container-sm { max-width: 640px; margin: 0 auto; padding: 0 1.5rem; }

    /* Cards */
    .sl-card {
      background: #FFFFFF;
      border: 1px solid var(--stone-100);
      border-radius: var(--radius-xl);
      padding: 2rem;
      box-shadow: var(--shadow-sm);
    }
    .sl-card-hover {
      transition: box-shadow 0.2s ease, transform 0.2s ease;
    }
    .sl-card-hover:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    /* Inputs */
    .sl-input {
      width: 100%;
      padding: 0.875rem 1.125rem;
      font-family: var(--font-sans);
      font-size: 1rem;
      font-weight: 400;
      color: var(--stone-900);
      background: var(--cream);
      border: 1.5px solid var(--stone-200);
      border-radius: var(--radius-md);
      transition: border-color 0.15s, box-shadow 0.15s;
      outline: none;
    }
    .sl-input::placeholder { color: var(--stone-300); }
    .sl-input:focus { border-color: var(--sage); box-shadow: 0 0 0 3px rgba(92,122,106,0.15); }
    .sl-textarea { resize: vertical; min-height: 100px; }

    /* Buttons */
    .sl-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
      padding: 0.875rem 1.75rem;
      font-family: var(--font-sans);
      font-size: 0.9375rem;
      font-weight: 600;
      border-radius: var(--radius-md);
      border: none;
      cursor: pointer;
      transition: all 0.18s ease;
      text-decoration: none;
      white-space: nowrap;
    }
    .sl-btn:disabled { opacity: 0.45; cursor: not-allowed; }
    .sl-btn-primary { background: var(--sage); color: #fff; }
    .sl-btn-primary:hover:not(:disabled) { background: var(--sage-dark); box-shadow: 0 4px 14px rgba(92,122,106,0.35); }
    .sl-btn-secondary { background: var(--cream-dark); color: var(--stone-700); border: 1.5px solid var(--stone-200); }
    .sl-btn-secondary:hover:not(:disabled) { background: var(--stone-100); border-color: var(--stone-300); }
    .sl-btn-ghost { background: transparent; color: var(--stone-500); border: 1.5px solid var(--stone-200); }
    .sl-btn-ghost:hover:not(:disabled) { background: var(--cream-dark); color: var(--stone-700); }
    .sl-btn-danger { background: var(--rose-light); color: var(--rose); border: 1.5px solid rgba(176,92,92,0.2); }
    .sl-btn-danger:hover:not(:disabled) { background: var(--rose); color: #fff; }
    .sl-btn-sm { padding: 0.5rem 1rem; font-size: 0.875rem; }
    .sl-btn-lg { padding: 1.125rem 2.25rem; font-size: 1.0625rem; }
    .sl-btn-full { width: 100%; }

    /* Badges */
    .sl-badge {
      display: inline-flex; align-items: center; gap: 0.3rem;
      padding: 0.25rem 0.75rem;
      font-size: 0.75rem; font-weight: 600;
      border-radius: 99px;
    }
    .sl-badge-sage { background: var(--sage-light); color: var(--sage-dark); }
    .sl-badge-amber { background: var(--amber-light); color: var(--amber); }
    .sl-badge-sky { background: var(--sky-light); color: var(--sky); }
    .sl-badge-rose { background: var(--rose-light); color: var(--rose); }
    .sl-badge-stone { background: var(--stone-100); color: var(--stone-700); }

    /* Tabs */
    .sl-tabs { display: flex; gap: 0.25rem; background: var(--cream-dark); padding: 0.3rem; border-radius: var(--radius-lg); width: fit-content; }
    .sl-tab {
      padding: 0.6rem 1.2rem;
      font-family: var(--font-sans); font-size: 0.875rem; font-weight: 500;
      color: var(--stone-500); border-radius: var(--radius-md);
      border: none; background: transparent; cursor: pointer;
      transition: all 0.15s ease; white-space: nowrap;
    }
    .sl-tab.active { background: #fff; color: var(--stone-900); font-weight: 600; box-shadow: var(--shadow-sm); }
    .sl-tab:hover:not(.active) { color: var(--stone-700); background: rgba(255,255,255,0.5); }

    /* Topbar */
    .sl-topbar {
      background: #fff;
      border-bottom: 1px solid var(--stone-100);
      padding: 1rem 1.5rem;
      display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; z-index: 50;
      gap: 1rem; flex-wrap: wrap;
    }

    /* Lang switcher */
    .sl-lang { display: flex; gap: 0.25rem; background: var(--cream-dark); padding: 0.25rem; border-radius: var(--radius-md); }
    .sl-lang-btn {
      padding: 0.35rem 0.75rem; font-size: 0.8125rem; font-weight: 600;
      border: none; background: transparent; cursor: pointer; border-radius: calc(var(--radius-md) - 2px);
      color: var(--stone-500); transition: all 0.15s;
    }
    .sl-lang-btn.active { background: #fff; color: var(--stone-900); box-shadow: var(--shadow-sm); }

    /* Progress bar */
    .sl-progress-track { height: 6px; background: var(--stone-100); border-radius: 99px; overflow: hidden; }
    .sl-progress-fill { height: 100%; background: var(--sage); border-radius: 99px; transition: width 0.4s ease; }

    /* Divider */
    .sl-divider { border: none; border-top: 1px solid var(--stone-100); margin: 1.5rem 0; }

    /* Section */
    .sl-section { padding: 2rem 0; }

    /* Stat card */
    .sl-stat { text-align: center; }
    .sl-stat-value { font-family: var(--font-serif); font-size: 2rem; color: var(--stone-900); line-height: 1; }
    .sl-stat-label { font-size: 0.8125rem; color: var(--stone-500); font-weight: 500; margin-top: 0.25rem; }

    /* Countdown */
    .sl-countdown { display: inline-flex; align-items: center; gap: 0.375rem; font-size: 0.8125rem; font-weight: 600; }
    .sl-countdown-overdue { color: var(--rose); }
    .sl-countdown-urgent { color: var(--amber); }
    .sl-countdown-ok { color: var(--sky); }

    /* Answer option */
    .sl-option {
      border: 2px solid var(--stone-100);
      border-radius: var(--radius-lg);
      background: #fff;
      cursor: pointer; transition: all 0.15s; text-align: left; width: 100%;
      overflow: hidden;
    }
    .sl-option:hover { border-color: var(--sage-mid); background: var(--sage-light); }
    .sl-option.selected { border-color: var(--sage); background: var(--sage-light); }
    .sl-option-inner { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; }
    .sl-option-key {
      width: 2.5rem; height: 2.5rem; border-radius: var(--radius-sm);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 1rem; flex-shrink: 0;
      background: var(--stone-100); color: var(--stone-700);
      transition: all 0.15s;
    }
    .sl-option.selected .sl-option-key { background: var(--sage); color: #fff; }

    /* Notification popup */
    .sl-notification {
      position: fixed; top: 1.5rem; left: 50%; transform: translateX(-50%);
      z-index: 300;
      background: var(--stone-900); color: #fff;
      padding: 1rem 1.75rem;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      display: flex; align-items: center; gap: 1rem;
      animation: slideDown 0.3s ease;
      white-space: nowrap;
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateX(-50%) translateY(-12px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    /* Video container */
    .sl-video-wrap {
      background: var(--stone-900);
      border-radius: var(--radius-lg);
      overflow: hidden;
      aspect-ratio: 16/9;
    }
    .sl-video-wrap video { width: 100%; height: 100%; display: block; }

    /* Leaderboard */
    .sl-rank-1 { background: linear-gradient(135deg, #FBF5E6, #F5E9C8); border-color: #D4AD6A; }
    .sl-rank-2 { background: linear-gradient(135deg, #F4F4F6, #E8E8EE); border-color: #9E9EB2; }
    .sl-rank-3 { background: linear-gradient(135deg, #FBF0EB, #F2E4DA); border-color: #C4956A; }

    /* Empty state */
    .sl-empty { text-align: center; padding: 4rem 2rem; color: var(--stone-400); }
    .sl-empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }

    /* Score result */
    .sl-result-gold { background: linear-gradient(135deg, #B8860B, #D4A017); }
    .sl-result-green { background: linear-gradient(135deg, var(--sage-dark), var(--sage)); }
    .sl-result-blue { background: linear-gradient(135deg, #2D6A8F, var(--sky)); }
    .sl-result-orange { background: linear(135deg, #B8620B, var(--amber)); }
    .sl-result-red { background: linear-gradient(135deg, #7A2020, var(--rose)); }

    /* Tooltip / hint */
    .sl-hint { background: var(--amber-light); border: 1px solid rgba(196,135,74,0.3); border-radius: var(--radius-md); padding: 0.875rem 1.125rem; }
    .sl-hint p { color: var(--amber); font-weight: 500; font-size: 0.9375rem; margin: 0; }

    /* Image upload preview zone */
    .sl-upload-zone {
      border: 2px dashed var(--stone-200);
      border-radius: var(--radius-lg);
      padding: 2rem;
      text-align: center;
      background: var(--cream);
      cursor: pointer;
      transition: border-color 0.15s, background 0.15s;
    }
    .sl-upload-zone:hover { border-color: var(--sage); background: var(--sage-light); }

    /* Accessible large text mode compatibility */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
    }

    /* Responsive */
    @media (max-width: 640px) {
      .sl-card { padding: 1.25rem; }
      .sl-topbar { padding: 0.875rem 1rem; }
    }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════════════════════════════════════════ */
const LangSwitcher = () => {
  const { lang, switchLang, LANGS } = useLang();

  return (
    <div className="sl-lang" role="navigation" aria-label="Language">
      {Object.values(LANGS).map((l) => (
        <button
          key={l.code}
          onClick={() => switchLang(l.code)}
          className={`sl-lang-btn ${lang === l.code ? "active" : ""}`}
          aria-pressed={lang === l.code}
        >
          {l.flag} {l.label}
        </button>
      ))}
    </div>
  );
};

const DiffBadge = ({ level }) => {
  const { t } = useLang();

  const map = {
    easy: "sl-badge sl-badge-sage",
    medium: "sl-badge sl-badge-amber",
    hard: "sl-badge sl-badge-rose",
  };

  return (
    <span className={map[level] || map.medium}>
      {t[level] || level}
    </span>
  );
};

const CountdownBadge = ({ dueDate }) => {
  const { t } = useLang();
  const [display, setDisplay] = useState("");
  const [status, setStatus] = useState("ok");

  useEffect(() => {
    if (!dueDate) return;

    const tick = () => {
      const diff = new Date(dueDate) - new Date();

      if (diff <= 0) {
        setStatus("overdue");
        setDisplay(t.overdue);
        return;
      }

      const days = Math.floor(diff / 86400000);
      const hrs = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);

      setStatus(diff < 86400000 ? "urgent" : "ok");

      setDisplay(
        days > 0
          ? `${t.dueIn} ${days} ${t.daysLeft}`
          : hrs > 0
          ? `${t.dueIn} ${hrs} ${t.hoursLeft}`
          : `${t.dueIn} ${mins} ${t.minsLeft}`
      );
    };

    tick();

    const id = setInterval(tick, 30000);

    return () => clearInterval(id);
  }, [dueDate, t]);

  if (!dueDate) return null;

  const cls = `sl-countdown sl-countdown-${status}`;

  return (
    <span className={cls} role="timer">
      ⏰ {display}
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   BADGE CARD
═══════════════════════════════════════════════════════════════════════════ */
const BadgeCard = ({ badge, locked = false }) => (
        
  <div
    className={`sl-card ${locked ? "" : "sl-card-hover"}`}
    style={{
      opacity: locked ? 0.5 : 1,
      textAlign: "center",
      padding: "1.5rem 1rem",
    }}
  >
    <div style={{ fontSize: "2.75rem", marginBottom: "0.75rem" }}>
      {badge.emoji}
    </div>
    <p
      style={{
        fontWeight: 600,
        fontSize: "0.9375rem",
        color: "var(--stone-800)",
        marginBottom: "0.25rem",
      }}
    >
      {badge.label}
    </p>
    <p style={{ fontSize: "0.8125rem", color: "var(--stone-500)" }}>
      {badge.desc}
    </p>
    {badge.earned_at && !locked && (
      <p
        style={{
          fontSize: "0.75rem",
          color: "var(--sage)",
          fontWeight: 600,
          marginTop: "0.75rem",
        }}
      >
        {badge.earned_at}
      </p>
    )}
    {locked && (
      <p
        style={{
          fontSize: "0.75rem",
          color: "var(--stone-400)",
          marginTop: "0.75rem",
        }}
      >
        Not yet earned
      </p>
    )}

  <div className={`sl-card ${locked ? "" : "sl-card-hover"}`}
    style={{ opacity: locked ? 0.5 : 1, textAlign: "center", padding: "1.5rem 1rem" }}>
    <div style={{ fontSize: "2.75rem", marginBottom: "0.75rem" }}>{badge.emoji}</div>
    <p style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--stone-800)", marginBottom: "0.25rem" }}>{badge.label}</p>
    <p style={{ fontSize: "0.8125rem", color: "var(--stone-500)" }}>{badge.desc}</p>
    {badge.earned_at && !locked && (
      <p style={{ fontSize: "0.75rem", color: "var(--sage)", fontWeight: 600, marginTop: "0.75rem" }}>{badge.earned_at}</p>
    )}
    {locked && <p style={{ fontSize: "0.75rem", color: "var(--stone-400)", marginTop: "0.75rem" }}>Not yet earned</p>}

  </div>
);
    };
/* ═══════════════════════════════════════════════════════════════════════════
   SIGN OF DAY CARD
═══════════════════════════════════════════════════════════════════════════ */
const SignOfDayCard = () => {
  const { t } = useLang();
  const [sign, setSign] = useState(null);

  useEffect(() => {
    axios.get(`${API}/sign_of_day`).then((r) => setSign(r.data));
  }, []);

  if (!sign) return null;

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, var(--sage-dark) 0%, var(--sage) 100%)",
        borderRadius: "var(--radius-xl)",
        padding: "2rem",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: "1.5rem",
        marginBottom: "1.5rem",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div style={{ fontSize: "3.5rem", flexShrink: 0, lineHeight: 1 }}>
        🤟
      </div>

      <div style={{ flex: 1 }}>
        <p
          className="sl-label"
          style={{
            color: "rgba(255,255,255,0.7)",
            marginBottom: "0.3rem",
          }}
        >
          {t.todaysSign} · {sign.date}
        </p>

        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.75rem",
            fontWeight: 400,
            margin: "0 0 0.3rem",
          }}
        >
          {sign.word}
        </h2>

        <p
          style={{
            fontSize: "0.9375rem",
            opacity: 0.85,
            margin: 0,
          }}
        >
          {sign.description}
        </p>
      </div>

      {sign.image_url && (
        <img
          src={sign.image_url}
          alt={sign.word}
          style={{
            width: "6rem",
            height: "6rem",
            borderRadius: "var(--radius-lg)",
            objectFit: "cover",
            border: "3px solid rgba(255,255,255,0.3)",
            flexShrink: 0,
          }}
        />
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   DICTIONARY VIEWER
═══════════════════════════════════════════════════════════════════════════ */
const DictionaryViewer = () => {
  const { t } = useLang();
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios.get(`${API}/dictionary`).then((r) => setEntries(r.data));
    axios
      .get(`${API}/dictionary/categories`)
      .then((r) => setCategories(r.data));
  }, []);

  const filtered = entries.filter((e) => {
    const matchSearch =
      e.word.toLowerCase().includes(search.toLowerCase()) ||
      (e.description || "").toLowerCase().includes(search.toLowerCase());

  const filtered = entries.filter(e => {
    const matchSearch = e.word.toLowerCase().includes(search.toLowerCase()) || (e.description || "").toLowerCase().includes(search.toLowerCase());

    const matchCat = category === "All" || e.category === category;
    return matchSearch && matchCat;
  });
  return (
    <div>

      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1.25rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          className="sl-input"
          style={{ flex: 1, minWidth: "200px" }}
          placeholder={t.searchSigns}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        {["All", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`sl-btn sl-btn-sm ${category === c ? "sl-btn-primary" : "sl-btn-ghost"}`}
          >
            {c === "All" ? t.allCategories : c}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="sl-empty">
          <div className="sl-empty-icon">🔍</div>
          <p>{t.noDictEntries}</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "1rem",
          }}
        >
          {filtered.map((e) => (
            <div
              key={e.id}
              className="sl-card sl-card-hover"
              style={{ padding: 0, overflow: "hidden" }}
            >
              <div
                style={{
                  aspectRatio: "1",
                  background: "var(--cream)",
                  overflow: "hidden",
                }}
              >
                <img
                  src={e.image_url}
                  alt={e.word}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ padding: "0.875rem" }}>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    margin: "0 0 0.2rem",
                    color: "var(--stone-900)",
                  }}
                >
                  {e.word}
                </p>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--sage)",
                    fontWeight: 500,
                    margin: 0,
                  }}
                >
                  {e.category}
                </p>
                {e.description && (
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--stone-400)",
                      marginTop: "0.25rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {e.description}
                  </p>
                )}

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
        <input className="sl-input" style={{ flex: 1, minWidth: "200px" }}
          placeholder={t.searchSigns} value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {["All", ...categories].map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`sl-btn sl-btn-sm ${category === c ? "sl-btn-primary" : "sl-btn-ghost"}`}>
            {c === "All" ? t.allCategories : c}
          </button>
        ))}
      </div>
      {filtered.length === 0
        ? <div className="sl-empty"><div className="sl-empty-icon">🔍</div><p>{t.noDictEntries}</p></div>
        : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem" }}>
          {filtered.map(e => (
            <div key={e.id} className="sl-card sl-card-hover" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ aspectRatio: "1", background: "var(--cream)", overflow: "hidden" }}>
                <img src={e.image_url} alt={e.word} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "0.875rem" }}>
                <p style={{ fontWeight: 600, fontSize: "0.9375rem", margin: "0 0 0.2rem", color: "var(--stone-900)" }}>{e.word}</p>
                <p style={{ fontSize: "0.8125rem", color: "var(--sage)", fontWeight: 500, margin: 0 }}>{e.category}</p>
                {e.description && <p style={{ fontSize: "0.75rem", color: "var(--stone-400)", marginTop: "0.25rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.description}</p>}

              </div>
            </div>
          ))}
        </div>
      )}
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
    const url = isTeacher
      ? `${API}/teacher/doubts`
      : `${API}/student/doubts/${ano}`;
    axios.get(url).then((r) => setDoubts(r.data));
  }, [ano, isTeacher]);
  useEffect(() => {
    load();
    socket.on("new_doubt", (d) => {
      if (isTeacher || d.assignment_no === ano) setDoubts((p) => [d, ...p]);
    });
    socket.on("doubt_replied", ({ doubt_id, reply }) => {
      setDoubts((p) =>
        p.map((d) =>
          d.id === doubt_id ? { ...d, replies: [...d.replies, reply] } : d,
        ),
      );
    });
    return () => {
      socket.off("new_doubt");
      socket.off("doubt_replied");
    };
  }, [load]);
  const submitDoubt = async () => {
    if (!newQ.trim()) return;
    setPosting(true);
    await axios.post(`${API}/student/doubts`, {
      username,
      assignment_no: ano,
      question: newQ,
    });
    setNewQ("");
    setPosting(false);
  };
  const submitReply = async (id) => {
    if (!replyText[id]?.trim()) return;
    await axios.post(`${API}/teacher/doubts/${id}/reply`, {
      author: username,
      body: replyText[id],
    });
    setReplyText((p) => ({ ...p, [id]: "" }));
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {!isTeacher && (

        <div
          style={{
            background: "var(--sage-light)",
            border: "1px solid var(--sage-mid)",
            borderRadius: "var(--radius-lg)",
            padding: "1.25rem",
          }}
        >
          <p
            style={{
              fontWeight: 600,
              color: "var(--sage-dark)",
              marginBottom: "0.75rem",
              fontSize: "0.9375rem",
            }}
          >
            {t.askDoubt}
          </p>
          <textarea
            className="sl-input sl-textarea"
            style={{ marginBottom: "0.75rem" }}
            rows={3}
            placeholder={t.doubtPlaceholder}
            value={newQ}
            onChange={(e) => setNewQ(e.target.value)}
          />
          <button
            onClick={submitDoubt}
            disabled={posting || !newQ.trim()}
            className="sl-btn sl-btn-primary sl-btn-sm"
          >

        <div style={{ background: "var(--sage-light)", border: "1px solid var(--sage-mid)", borderRadius: "var(--radius-lg)", padding: "1.25rem" }}>
          <p style={{ fontWeight: 600, color: "var(--sage-dark)", marginBottom: "0.75rem", fontSize: "0.9375rem" }}>{t.askDoubt}</p>
          <textarea className="sl-input sl-textarea" style={{ marginBottom: "0.75rem" }}
            rows={3} placeholder={t.doubtPlaceholder} value={newQ} onChange={e => setNewQ(e.target.value)} />
          <button onClick={submitDoubt} disabled={posting || !newQ.trim()} className="sl-btn sl-btn-primary sl-btn-sm">

            {posting ? "…" : t.submitDoubt}
          </button>
        </div>
      )}

      {doubts.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "var(--stone-400)",
            fontSize: "0.9375rem",
          }}
        >
          {t.noDoubts}
        </p>
      ) : (
        doubts.map((d) => (
          <div
            key={d.id}
            style={{
              background: "#fff",
              border: "1px solid var(--stone-100)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
            }}
          >
            <button
              style={{
                width: "100%",
                padding: "1rem 1.25rem",
                textAlign: "left",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "1rem",
              }}
              onClick={() => setOpenId(openId === d.id ? null : d.id)}
            >
              <div style={{ flex: 1 }}>
                {isTeacher && (
                  <span
                    className="sl-badge sl-badge-sage"
                    style={{
                      marginRight: "0.5rem",
                      marginBottom: "0.4rem",
                      display: "inline-flex",
                    }}
                  >
                    {t.doubtFor} {d.assignment_no}
                  </span>
                )}
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--stone-400)",
                    fontWeight: 500,
                    margin: "0 0 0.2rem",
                  }}
                >
                  {d.student_name} · {d.created_at}
                </p>
                <p
                  style={{
                    fontWeight: 500,
                    color: "var(--stone-800)",
                    fontSize: "0.9375rem",
                    margin: 0,
                  }}
                >
                  {d.question}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  flexShrink: 0,
                }}
              >
                {d.replies.length > 0 ? (
                  <span className="sl-badge sl-badge-sage">
                    ✓ {d.replies.length}
                  </span>
                ) : (
                  <span className="sl-badge sl-badge-amber">Pending</span>
                )}
                <span
                  style={{ color: "var(--stone-300)", fontSize: "0.75rem" }}
                >
                  {openId === d.id ? "▲" : "▼"}
                </span>
              </div>
            </button>
            {openId === d.id && (
              <div
                style={{
                  borderTop: "1px solid var(--stone-100)",
                  background: "var(--cream)",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {d.replies.length === 0 && (
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--stone-400)",
                      fontStyle: "italic",
                    }}
                  >
                    {t.unanswered}
                  </p>
                )}
                {d.replies.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      background: "var(--sage-light)",
                      border: "1px solid rgba(92,122,106,0.2)",
                      borderRadius: "var(--radius-md)",
                      padding: "0.875rem",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--sage)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {r.author} · {r.created_at}
                    </p>
                    <p
                      style={{
                        fontSize: "0.9375rem",
                        color: "var(--stone-800)",
                        margin: 0,
                      }}
                    >
                      {r.body}
                    </p>

      {doubts.length === 0
        ? <p style={{ textAlign: "center", padding: "2rem", color: "var(--stone-400)", fontSize: "0.9375rem" }}>{t.noDoubts}</p>
        : doubts.map(d => (
          <div key={d.id} style={{ background: "#fff", border: "1px solid var(--stone-100)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            <button style={{ width: "100%", padding: "1rem 1.25rem", textAlign: "left", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}
              onClick={() => setOpenId(openId === d.id ? null : d.id)}>
              <div style={{ flex: 1 }}>
                {isTeacher && <span className="sl-badge sl-badge-sage" style={{ marginRight: "0.5rem", marginBottom: "0.4rem", display: "inline-flex" }}>{t.doubtFor} {d.assignment_no}</span>}
                <p style={{ fontSize: "0.8125rem", color: "var(--stone-400)", fontWeight: 500, margin: "0 0 0.2rem" }}>{d.student_name} · {d.created_at}</p>
                <p style={{ fontWeight: 500, color: "var(--stone-800)", fontSize: "0.9375rem", margin: 0 }}>{d.question}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                {d.replies.length > 0
                  ? <span className="sl-badge sl-badge-sage">✓ {d.replies.length}</span>
                  : <span className="sl-badge sl-badge-amber">Pending</span>}
                <span style={{ color: "var(--stone-300)", fontSize: "0.75rem" }}>{openId === d.id ? "▲" : "▼"}</span>
              </div>
            </button>
            {openId === d.id && (
              <div style={{ borderTop: "1px solid var(--stone-100)", background: "var(--cream)", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {d.replies.length === 0 && <p style={{ fontSize: "0.9rem", color: "var(--stone-400)", fontStyle: "italic" }}>{t.unanswered}</p>}
                {d.replies.map(r => (
                  <div key={r.id} style={{ background: "var(--sage-light)", border: "1px solid rgba(92,122,106,0.2)", borderRadius: "var(--radius-md)", padding: "0.875rem" }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--sage)", marginBottom: "0.25rem" }}>{r.author} · {r.created_at}</p>
                    <p style={{ fontSize: "0.9375rem", color: "var(--stone-800)", margin: 0 }}>{r.body}</p>

                  </div>
                ))}
                {isTeacher && (
                  <div style={{ display: "flex", gap: "0.5rem" }}>

                    <input
                      className="sl-input"
                      style={{ flex: 1 }}
                      placeholder={t.replyPlaceholder}
                      value={replyText[d.id] || ""}
                      onChange={(e) =>
                        setReplyText((p) => ({ ...p, [d.id]: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === "Enter" && submitReply(d.id)}
                    />
                    <button
                      onClick={() => submitReply(d.id)}
                      className="sl-btn sl-btn-primary sl-btn-sm"
                    >
                      {t.sendReply}
                    </button>

                    <input className="sl-input" style={{ flex: 1 }}
                      placeholder={t.replyPlaceholder} value={replyText[d.id] || ""}
                      onChange={e => setReplyText(p => ({ ...p, [d.id]: e.target.value }))}
                      onKeyDown={e => e.key === "Enter" && submitReply(d.id)} />
                    <button onClick={() => submitReply(d.id)} className="sl-btn sl-btn-primary sl-btn-sm">{t.sendReply}</button>

                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   TIMER HOOK
═══════════════════════════════════════════════════════════════════════════ */
const useTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const ref = useRef(null);
  const start = useCallback(() => {
    ref.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }, []);
  const stop = useCallback(() => {
    clearInterval(ref.current);
    return seconds;
  }, [seconds]);
  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  return { seconds, start, stop, fmt };
};

/* ═══════════════════════════════════════════════════════════════════════════
   QUIZ OVERLAY
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
    axios.get(`${API}/student/quiz/${ano}`).then((r) => {
      setQs(r.data);
      setLoading(false);
      start();
    });
    socket.on("new_badge", ({ student, badge }) => {
      if (student === user.username) {
        setNewBadge(badge);
        setTimeout(() => setNewBadge(null), 4000);
      }
    });
    return () => socket.off("new_badge");
  }, [ano]);

  const submitForm = async () => {
    if (Object.keys(answers).length < qs.length) {
      setError(
        `${t.answerAll} (${qs.length - Object.keys(answers).length} ${t.remaining})`,
      );
      return;
    }
    setError("");
    let hits = 0;
    qs.forEach((q, i) => {
      if (answers[i]?.toUpperCase() === q.correct?.toUpperCase()) hits++;
    });
    const pct = Math.round((hits / (qs.length || 1)) * 100);
    const timeTaken = stop();
    const r = await axios.post(`${API}/submit_quiz`, {
      username: user.username,
      topic,
      score: pct,
      time_taken: timeTaken,
    });
    setResult(r.data);
  };

  const q = qs[current];


  if (loading)
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "var(--cream)",
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🤟</div>
          <p className="sl-subheading">{t.loadingQuiz}</p>
        </div>

  if (loading) return (
    <div style={{ position: "fixed", inset: 0, background: "var(--cream)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🤟</div>
        <p className="sl-subheading">{t.loadingQuiz}</p>

      </div>
    );

<<<<<<< HEAD
  if (qs.length === 0)
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "var(--cream)",
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
          <p className="sl-subheading">{t.noQuestions}</p>
          <button
            onClick={() => onClose(null)}
            className="sl-btn sl-btn-secondary"
            style={{ marginTop: "1.5rem" }}
          >
            {t.goBack}
          </button>
        </div>

  if (qs.length === 0) return (
    <div style={{ position: "fixed", inset: 0, background: "var(--cream)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
        <p className="sl-subheading">{t.noQuestions}</p>
        <button onClick={() => onClose(null)} className="sl-btn sl-btn-secondary" style={{ marginTop: "1.5rem" }}>{t.goBack}</button>

      </div>
    );

  return (

    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--cream)",
        zIndex: 200,
        overflowY: "auto",
      }}
    >

    <div style={{ position: "fixed", inset: 0, background: "var(--cream)", zIndex: 200, overflowY: "auto" }}>

      {newBadge && (
        <div className="sl-notification">
          <span style={{ fontSize: "2rem" }}>{newBadge.emoji}</span>
          <div>

            <p style={{ fontWeight: 700, margin: "0 0 0.15rem" }}>
              Achievement unlocked
            </p>
            <p style={{ fontSize: "0.875rem", opacity: 0.8, margin: 0 }}>
              {newBadge.label}
            </p>

            <p style={{ fontWeight: 700, margin: "0 0 0.15rem" }}>Achievement unlocked</p>
            <p style={{ fontSize: "0.875rem", opacity: 0.8, margin: 0 }}>{newBadge.label}</p>

          </div>
        </div>
      )}

      {!result ? (

        <div
          className="sl-container"
          style={{ padding: "1.5rem", maxWidth: "720px" }}
        >
          {/* Header */}
          <div
            className="sl-card"
            style={{
              marginBottom: "1.5rem",
              position: "sticky",
              top: "1rem",
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <p className="sl-label" style={{ marginBottom: "0.2rem" }}>
                  {t.assignment} {ano}
                </p>
                <h1
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.25rem",
                    margin: 0,
                  }}
                >
                  {topic}
                </h1>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "var(--sage)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  ⏱ {fmt(seconds)}
                </span>
                <button
                  onClick={() => onClose(null)}
                  className="sl-btn sl-btn-ghost sl-btn-sm"
                >
                  ✕ {t.goBack}
                </button>
              </div>
            </div>
            {/* Nav dots */}
            <div
              style={{
                display: "flex",
                gap: "0.4rem",
                flexWrap: "wrap",
                marginTop: "1rem",
              }}
            >
              {qs.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "50%",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    border: `2px solid ${answers[i] ? "var(--sage)" : i === current ? "var(--stone-300)" : "var(--stone-100)"}`,
                    background: answers[i]
                      ? "var(--sage)"
                      : i === current
                        ? "var(--cream-dark)"
                        : "#fff",
                    color: answers[i] ? "#fff" : "var(--stone-700)",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >

        <div className="sl-container" style={{ padding: "1.5rem", maxWidth: "720px" }}>
          {/* Header */}
          <div className="sl-card" style={{ marginBottom: "1.5rem", position: "sticky", top: "1rem", zIndex: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <p className="sl-label" style={{ marginBottom: "0.2rem" }}>{t.assignment} {ano}</p>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", margin: 0 }}>{topic}</h1>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "1.25rem", fontWeight: 600, color: "var(--sage)", fontVariantNumeric: "tabular-nums" }}>⏱ {fmt(seconds)}</span>
                <button onClick={() => onClose(null)} className="sl-btn sl-btn-ghost sl-btn-sm">✕ {t.goBack}</button>
              </div>
            </div>
            {/* Nav dots */}
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "1rem" }}>
              {qs.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  style={{
                    width: "2rem", height: "2rem", borderRadius: "50%", fontSize: "0.8125rem", fontWeight: 600,
                    border: `2px solid ${answers[i] ? "var(--sage)" : i === current ? "var(--stone-300)" : "var(--stone-100)"}`,
                    background: answers[i] ? "var(--sage)" : i === current ? "var(--cream-dark)" : "#fff",
                    color: answers[i] ? "#fff" : "var(--stone-700)",
                    cursor: "pointer", transition: "all 0.15s"
                  }}>

                  {i + 1}
                </button>
              ))}
            </div>

            <div
              className="sl-progress-track"
              style={{ marginTop: "0.875rem" }}
            >
              <div
                className="sl-progress-fill"
                style={{
                  width: `${(Object.keys(answers).length / qs.length) * 100}%`,
                }}
              />

            <div className="sl-progress-track" style={{ marginTop: "0.875rem" }}>
              <div className="sl-progress-fill" style={{ width: `${(Object.keys(answers).length / qs.length) * 100}%` }} />

            </div>
          </div>

          {/* Question */}
          {q && (
            <div className="sl-card" style={{ marginBottom: "1rem" }}>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                  flexWrap: "wrap",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.4rem",
                    fontWeight: 400,
                    margin: 0,
                    flex: 1,
                    lineHeight: 1.3,
                  }}
                >

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 400, margin: 0, flex: 1, lineHeight: 1.3 }}>

                  {current + 1}. {q.text}
                </h2>
                <DiffBadge level={q.difficulty} />
              </div>

              {q.image && (

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      background: "var(--cream)",
                      border: "2px solid var(--stone-100)",
                      borderRadius: "var(--radius-lg)",
                      overflow: "hidden",
                      padding: "0.5rem",
                      maxWidth: "340px",
                    }}
                  >
                    <img
                      src={q.image}
                      alt="Sign to identify"
                      style={{
                        maxHeight: "240px",
                        width: "auto",
                        display: "block",
                        margin: "0 auto",
                        borderRadius: "var(--radius-md)",
                      }}
                    />

                <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
                  <div style={{ background: "var(--cream)", border: "2px solid var(--stone-100)", borderRadius: "var(--radius-lg)", overflow: "hidden", padding: "0.5rem", maxWidth: "340px" }}>
                    <img src={q.image} alt="Sign to identify"
                      style={{ maxHeight: "240px", width: "auto", display: "block", margin: "0 auto", borderRadius: "var(--radius-md)" }} />

                  </div>
                </div>
              )}

              {q.hint && (
                <div style={{ marginBottom: "1.25rem" }}>

                  {!hintUsed[current] ? (
                    <button
                      onClick={() =>
                        setHintUsed({ ...hintUsed, [current]: true })
                      }
                      className="sl-btn sl-btn-ghost sl-btn-sm"
                    >
                      💡 {t.useHint}
                    </button>
                  ) : (
                    <div className="sl-hint">
                      <p>
                        <strong style={{ marginRight: "0.4rem" }}>
                          {t.hintLabel}
                        </strong>
                        {q.hint}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.875rem",
                }}
              >
                {["A", "B", "C", "D"].map((opt) => {
                  const isSelected = answers[current]?.toUpperCase() === opt;
                  const optImg = q[`img_${opt.toLowerCase()}`];
                  return (
                    <button
                      key={opt}
                      onClick={() => setAnswers({ ...answers, [current]: opt })}
                      className={`sl-option ${isSelected ? "selected" : ""}`}
                      aria-pressed={isSelected}
                      aria-label={`Option ${opt}: ${q[opt.toLowerCase()]}`}
                    >
                      {optImg && (
                        <div
                          style={{
                            aspectRatio: "16/9",
                            overflow: "hidden",
                            background: "var(--cream)",
                          }}
                        >
                          <img
                            src={optImg}
                            alt={`Option ${opt}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />

                  {!hintUsed[current]
                    ? <button onClick={() => setHintUsed({ ...hintUsed, [current]: true })}
                      className="sl-btn sl-btn-ghost sl-btn-sm">
                      💡 {t.useHint}
                    </button>
                    : <div className="sl-hint">
                      <p><strong style={{ marginRight: "0.4rem" }}>{t.hintLabel}</strong>{q.hint}</p>
                    </div>}
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                {["A", "B", "C", "D"].map(opt => {
                  const isSelected = answers[current]?.toUpperCase() === opt;
                  const optImg = q[`img_${opt.toLowerCase()}`];
                  return (
                    <button key={opt} onClick={() => setAnswers({ ...answers, [current]: opt })}
                      className={`sl-option ${isSelected ? "selected" : ""}`}
                      aria-pressed={isSelected} aria-label={`Option ${opt}: ${q[opt.toLowerCase()]}`}>
                      {optImg && (
                        <div style={{ aspectRatio: "16/9", overflow: "hidden", background: "var(--cream)" }}>
                          <img src={optImg} alt={`Option ${opt}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />

                        </div>
                      )}
                      <div className="sl-option-inner">
                        <span className="sl-option-key">{opt}</span>

                        <span
                          style={{
                            fontWeight: 500,
                            fontSize: "0.9375rem",
                            color: isSelected
                              ? "var(--sage-dark)"
                              : "var(--stone-700)",
                          }}
                        >
                          {q[opt.toLowerCase()]}
                        </span>

                        <span style={{ fontWeight: 500, fontSize: "0.9375rem", color: isSelected ? "var(--sage-dark)" : "var(--stone-700)" }}>{q[opt.toLowerCase()]}</span>

                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation */}

          <div
            style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}
          >
            <button
              onClick={() => setCurrent(Math.max(0, current - 1))}
              disabled={current === 0}
              className="sl-btn sl-btn-secondary"
              style={{ flex: 1 }}
            >
              {t.previous}
            </button>
            {current < qs.length - 1 ? (
              <button
                onClick={() => setCurrent(current + 1)}
                className="sl-btn sl-btn-primary"
                style={{ flex: 1 }}
              >
                {t.next}
              </button>
            ) : (
              <button
                onClick={submitForm}
                className="sl-btn sl-btn-primary"
                style={{ flex: 1 }}
              >
                {t.submitTest}
              </button>
            )}
          </div>
          {error && (
            <div
              style={{
                background: "var(--rose-light)",
                border: "1px solid rgba(176,92,92,0.2)",
                borderRadius: "var(--radius-md)",
                padding: "0.875rem 1rem",
                textAlign: "center",
              }}
            >
              <p style={{ color: "var(--rose)", fontWeight: 600, margin: 0 }}>
                {error}
              </p>

          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
            <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
              className="sl-btn sl-btn-secondary" style={{ flex: 1 }}>
              {t.previous}
            </button>
            {current < qs.length - 1
              ? <button onClick={() => setCurrent(current + 1)} className="sl-btn sl-btn-primary" style={{ flex: 1 }}>{t.next}</button>
              : <button onClick={submitForm} className="sl-btn sl-btn-primary" style={{ flex: 1 }}>{t.submitTest}</button>}
          </div>
          {error && (
            <div style={{ background: "var(--rose-light)", border: "1px solid rgba(176,92,92,0.2)", borderRadius: "var(--radius-md)", padding: "0.875rem 1rem", textAlign: "center" }}>
              <p style={{ color: "var(--rose)", fontWeight: 600, margin: 0 }}>{error}</p>

            </div>
          )}
        </div>
      ) : (
        /* RESULT SCREEN */

        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div
            style={{
              maxWidth: "520px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <div
              style={{
                borderRadius: "var(--radius-xl)",
                padding: "3rem 2rem",
                textAlign: "center",
                color: "#fff",
                background:
                  result.color === "gold"
                    ? "linear-gradient(135deg,#7A5C00,#C4980A)"
                    : result.color === "green"
                      ? "linear-gradient(135deg,var(--sage-dark),var(--sage))"
                      : result.color === "blue"
                        ? "linear-gradient(135deg,#2D6A8F,var(--sky))"
                        : result.color === "orange"
                          ? "linear-gradient(135deg,#7A4500,var(--amber))"
                          : "linear-gradient(135deg,#6A2020,var(--rose))",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <div style={{ fontSize: "4rem", marginBottom: "0.5rem" }}>
                {result.emoji}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "5rem",
                  lineHeight: 1,
                  margin: "0.25rem 0",
                }}
              >
                {result.score}%
              </div>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: "1.125rem",
                  opacity: 0.9,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  margin: "0.5rem 0 1rem",
                }}
              >
                {result.prediction}
              </p>
              <div
                style={{
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "var(--radius-md)",
                  padding: "1rem 1.25rem",
                  backdropFilter: "blur(4px)",
                }}
              >
                <p style={{ fontSize: "1rem", margin: 0 }}>
                  {result.suggestion}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "1.5rem",
                  marginTop: "1.25rem",
                  fontSize: "0.875rem",
                  opacity: 0.8,
                }}
              >
                <span>
                  +{result.xp} {t.xpEarned}
                </span>
                <span>
                  {t.attemptNo} #{result.attempt_no}
                </span>

        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div style={{ maxWidth: "520px", width: "100%", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{
              borderRadius: "var(--radius-xl)", padding: "3rem 2rem", textAlign: "center", color: "#fff",
              background: result.color === "gold" ? "linear-gradient(135deg,#7A5C00,#C4980A)"
                : result.color === "green" ? "linear-gradient(135deg,var(--sage-dark),var(--sage))"
                : result.color === "blue" ? "linear-gradient(135deg,#2D6A8F,var(--sky))"
                : result.color === "orange" ? "linear-gradient(135deg,#7A4500,var(--amber))"
                : "linear-gradient(135deg,#6A2020,var(--rose))",
              boxShadow: "var(--shadow-lg)"
            }}>
              <div style={{ fontSize: "4rem", marginBottom: "0.5rem" }}>{result.emoji}</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "5rem", lineHeight: 1, margin: "0.25rem 0" }}>{result.score}%</div>
              <p style={{ fontWeight: 700, fontSize: "1.125rem", opacity: 0.9, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0.5rem 0 1rem" }}>{result.prediction}</p>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "var(--radius-md)", padding: "1rem 1.25rem", backdropFilter: "blur(4px)" }}>
                <p style={{ fontSize: "1rem", margin: 0 }}>{result.suggestion}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "1.25rem", fontSize: "0.875rem", opacity: 0.8 }}>
                <span>+{result.xp} {t.xpEarned}</span>
                <span>{t.attemptNo} #{result.attempt_no}</span>

              </div>
            </div>

            {/* Answer review */}
            <div className="sl-card">

              <p className="sl-label" style={{ marginBottom: "0.875rem" }}>
                {t.scoreBreakdown}
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >

              <p className="sl-label" style={{ marginBottom: "0.875rem" }}>{t.scoreBreakdown}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>

                {qs.map((q, i) => {
                  const correct =
                    answers[i]?.toUpperCase() === q.correct?.toUpperCase();
                  return (

                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.875rem",
                        padding: "0.75rem 1rem",
                        borderRadius: "var(--radius-md)",
                        background: correct
                          ? "var(--sage-light)"
                          : "var(--rose-light)",
                        border: `1px solid ${correct ? "rgba(92,122,106,0.2)" : "rgba(176,92,92,0.15)"}`,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          color: correct ? "var(--sage)" : "var(--rose)",
                          fontSize: "1.125rem",
                        }}
                      >
                        {correct ? "✓" : "✗"}
                      </span>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--stone-700)",
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Q{i + 1}: {q.text}
                      </span>
                      {!correct && (
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: "var(--stone-500)",
                            flexShrink: 0,
                          }}
                        >
                          {t.correctAnswer2} {q.correct}
                        </span>
                      )}

                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.75rem 1rem",
                      borderRadius: "var(--radius-md)", background: correct ? "var(--sage-light)" : "var(--rose-light)",
                      border: `1px solid ${correct ? "rgba(92,122,106,0.2)" : "rgba(176,92,92,0.15)"}`
                    }}>
                      <span style={{ fontWeight: 700, color: correct ? "var(--sage)" : "var(--rose)", fontSize: "1.125rem" }}>{correct ? "✓" : "✗"}</span>
                      <span style={{ fontSize: "0.875rem", color: "var(--stone-700)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Q{i + 1}: {q.text}</span>
                      {!correct && <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--stone-500)", flexShrink: 0 }}>{t.correctAnswer2} {q.correct}</span>}

                    </div>
                  );
                })}
              </div>
            </div>


            <button
              onClick={() => onClose(result.suggestion)}
              className="sl-btn sl-btn-primary sl-btn-lg sl-btn-full"
            >

            <button onClick={() => onClose(result.suggestion)} className="sl-btn sl-btn-primary sl-btn-lg sl-btn-full">

              {t.backToLessons}
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
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "student",
  });
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    try {
      const r = await axios.post(
        `${API}/${isLogin ? "login" : "register"}`,
        form,
      );
      if (isLogin) {
        const u = { loggedIn: true, ...r.data };
        localStorage.setItem("user", JSON.stringify(u));
        setAuth(u);
        navigate(`/${r.data.role}`);
      } else {
        alert(t.accountCreated);
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.error || t.invalidCreds);
    }
  };

  return (
    <>
      <DesignSystem />

      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          background: "var(--cream)",
        }}
      >
        {/* Left: brand panel */}
        <div
          style={{
            background:
              "linear-gradient(160deg, var(--sage-dark) 0%, var(--sage) 60%, #8FB5A2 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "3rem",
            color: "#fff",
          }}
          className="auth-panel-left"
        >
          <div
            style={{ fontSize: "3.5rem", marginBottom: "2rem", lineHeight: 1 }}
          >
            🤟
          </div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 400,
              margin: "0 0 1rem",
              lineHeight: 1.05,
              color: "#fff",
            }}
          >
            {t.appName}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "1.125rem",
              opacity: 0.8,
              margin: "0 0 3rem",
              letterSpacing: "0.02em",
            }}
          >
            {t.appTagline}
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              width: "100%",
            }}
          >

      <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", background: "var(--cream)" }}>
        {/* Left: brand panel */}
        <div style={{
          background: "linear-gradient(160deg, var(--sage-dark) 0%, var(--sage) 60%, #8FB5A2 100%)",
          display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center",
          padding: "3rem", color: "#fff"
        }} className="auth-panel-left">
          <div style={{ fontSize: "3.5rem", marginBottom: "2rem", lineHeight: 1 }}>🤟</div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 400, margin: "0 0 1rem", lineHeight: 1.05, color: "#fff" }}>
            {t.appName}
          </h1>
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "1.125rem", opacity: 0.8, margin: "0 0 3rem", letterSpacing: "0.02em" }}>
            {t.appTagline}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%" }}>

            {[
              { icon: "👁", text: "See signs demonstrated clearly" },
              { icon: "📖", text: "Learn at your own pace" },
              { icon: "✋", text: "Build confidence step by step" },
            ].map((item, i) => (

              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <span
                  style={{
                    fontSize: "1.25rem",
                    background: "rgba(255,255,255,0.15)",
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </span>
                <p style={{ margin: 0, fontSize: "0.9375rem", opacity: 0.9 }}>
                  {item.text}
                </p>

              <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ fontSize: "1.25rem", background: "rgba(255,255,255,0.15)", width: "2.5rem", height: "2.5rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.icon}</span>
                <p style={{ margin: 0, fontSize: "0.9375rem", opacity: 0.9 }}>{item.text}</p>

              </div>
            ))}
          </div>
        </div>

        {/* Right: form */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>

          <div style={{ width: "100%", maxWidth: "420px" }}>
            <div style={{ marginBottom: "2rem" }}>
              <LangSwitcher />
            </div>
\
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.75rem",
                margin: "0 0 0.5rem",
                fontWeight: 400,
              }}
            >
              {isLogin ? t.welcomeBack : t.createAccount}
            </h2>
            <p
              style={{
                color: "var(--stone-500)",
                marginBottom: "2rem",
                fontSize: "0.9375rem",
              }}
            >
              {isLogin
                ? "Sign in to continue your learning journey."
                : "Join SignLearn today."}
            </p>
            <form
              onSubmit={handle}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <label
                  className="sl-label"
                  htmlFor="username"
                  style={{ display: "block", marginBottom: "0.4rem" }}
                >
                  {t.username}
                </label>
                <input
                  id="username"
                  required
                  className="sl-input"
                  placeholder={t.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  className="sl-label"
                  htmlFor="password"
                  style={{ display: "block", marginBottom: "0.4rem" }}
                >
                  {t.password}
                </label>
                <input
                  id="password"
                  required
                  type="password"
                  className="sl-input"
                  placeholder={t.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>
              {!isLogin && (
                <div>
                  <p className="sl-label" style={{ marginBottom: "0.5rem" }}>
                    I am a…
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.625rem",
                    }}
                  >
                    {[
                      { val: "student", label: t.roleStudent },
                      { val: "teacher", label: t.roleTeacher },
                    ].map((r) => (
                      <button
                        type="button"
                        key={r.val}
                        onClick={() => setForm({ ...form, role: r.val })}
                        className={`sl-btn ${form.role === r.val ? "sl-btn-primary" : "sl-btn-secondary"}`}
                        aria-pressed={form.role === r.val}
                      >

            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", margin: "0 0 0.5rem", fontWeight: 400 }}>
              {isLogin ? t.welcomeBack : t.createAccount}
            </h2>
            <p style={{ color: "var(--stone-500)", marginBottom: "2rem", fontSize: "0.9375rem" }}>
              {isLogin ? "Sign in to continue your learning journey." : "Join SignLearn today."}
            </p>
            <form onSubmit={handle} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="sl-label" htmlFor="username" style={{ display: "block", marginBottom: "0.4rem" }}>{t.username}</label>
                <input id="username" required className="sl-input" placeholder={t.username}
                  onChange={e => setForm({ ...form, username: e.target.value })} />
              </div>
              <div>
                <label className="sl-label" htmlFor="password" style={{ display: "block", marginBottom: "0.4rem" }}>{t.password}</label>
                <input id="password" required type="password" className="sl-input" placeholder={t.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
              {!isLogin && (
                <div>
                  <p className="sl-label" style={{ marginBottom: "0.5rem" }}>I am a…</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
                    {[{ val: "student", label: t.roleStudent }, { val: "teacher", label: t.roleTeacher }].map(r => (
                      <button type="button" key={r.val}
                        onClick={() => setForm({ ...form, role: r.val })}
                        className={`sl-btn ${form.role === r.val ? "sl-btn-primary" : "sl-btn-secondary"}`}
                        aria-pressed={form.role === r.val}>

                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="sl-btn sl-btn-primary sl-btn-lg sl-btn-full"
                style={{ marginTop: "0.5rem" }}
              >
                {isLogin ? t.signIn : t.createAccount}
              </button>
            </form>
            <p
              onClick={() => setIsLogin(!isLogin)}
              style={{
                textAlign: "center",
                marginTop: "1.5rem",
                color: "var(--sage)",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.9375rem",
              }}
              role="button"
              tabIndex={0}
            >

              <button type="submit" className="sl-btn sl-btn-primary sl-btn-lg sl-btn-full" style={{ marginTop: "0.5rem" }}>
                {isLogin ? t.signIn : t.createAccount}
              </button>
            </form>
            <p onClick={() => setIsLogin(!isLogin)}
              style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--sage)", fontWeight: 600, cursor: "pointer", fontSize: "0.9375rem" }}
              role="button" tabIndex={0}>

              {isLogin ? t.needAccount : t.alreadyAccount}
            </p>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .auth-panel-left { display: none !important; }
        }
      `}</style>
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   TOPBAR
═══════════════════════════════════════════════════════════════════════════ */
const Topbar = ({ user, title, role }) => {
  const { t } = useLang();
  return (
    <header className="sl-topbar">
      <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
        <span style={{ fontSize: "1.75rem", lineHeight: 1 }}>🤟</span>
        <div>

          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.25rem",
              color: "var(--stone-900)",
            }}
          >
            SignLearn
          </span>
          {role && (
            <span
              className="sl-badge sl-badge-sage"
              style={{ marginLeft: "0.5rem" }}
            >
              {role}
            </span>
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.875rem",
          flexWrap: "wrap",
        }}
      >
        <LangSwitcher />
        <span
          style={{
            color: "var(--stone-500)",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          {user.username}
        </span>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="sl-btn sl-btn-ghost sl-btn-sm"
        >

          <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--stone-900)" }}>SignLearn</span>
          {role && <span className="sl-badge sl-badge-sage" style={{ marginLeft: "0.5rem" }}>{role}</span>}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", flexWrap: "wrap" }}>
        <LangSwitcher />
        <span style={{ color: "var(--stone-500)", fontSize: "0.875rem", fontWeight: 500 }}>{user.username}</span>
        <button onClick={() => { localStorage.clear(); window.location.href = "/" }}
          className="sl-btn sl-btn-ghost sl-btn-sm">

          {t.logout}
        </button>
      </div>
    </header>
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

  const [sotd, setSotd] = useState({
    word: "",
    description: "",
    image_url: "",
  });
  const [sotdImgLoading, setSotdImgLoading] = useState(false);
  const [dictForm, setDictForm] = useState({
    word: "",
    category: "Greetings",
    description: "",
    image_url: "",
  });
  const [dictImgLoading, setDictImgLoading] = useState(false);
  const [q, setQ] = useState({
    assignment_no: 1,
    topic: "",
    text: "",
    opt_a: "",
    opt_b: "",
    opt_c: "",
    opt_d: "",
    correct_opt: "A",
    hint: "",
    difficulty: "medium",
  });

  const [sotd, setSotd] = useState({ word: "", description: "", image_url: "" });
  const [sotdImgLoading, setSotdImgLoading] = useState(false);
  const [dictForm, setDictForm] = useState({ word: "", category: "Greetings", description: "", image_url: "" });
  const [dictImgLoading, setDictImgLoading] = useState(false);
  const [q, setQ] = useState({ assignment_no: 1, topic: "", text: "", opt_a: "", opt_b: "", opt_c: "", opt_d: "", correct_opt: "A", hint: "", difficulty: "medium" });


  useEffect(() => {
    axios.get(`${API}/teacher/stats`).then((r) => setStats(r.data));
    axios.get(`${API}/teacher/leaderboard`).then((r) => setLb(r.data));
    axios.get(`${API}/sessions`).then((r) => setSessions(r.data));
    socket.on("new_stat", (d) => setStats((v) => [d, ...v]));
    return () => socket.off("new_stat");
  }, []);

  const uploadImg = async (file, key, setter, loadSetter) => {
    loadSetter(key);
    const fd = new FormData();
    fd.append("file", file);
    const r = await axios.post(`${API}/teacher/upload_image`, fd);
    setter((p) => ({ ...p, [key]: r.data.url }));
    loadSetter("");
  };

  const uploadVideo = async () => {
    if (!file) return alert(t.selectVideoFile);
    setSaving(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", q.topic);
    fd.append("assignment_no", q.assignment_no);
    if (q.due_date) fd.append("due_date", q.due_date);
    await axios.post(`${API}/teacher/upload`, fd);
    setSaving(false);
    alert(t.lessonSaved);
    axios.get(`${API}/sessions`).then((r) => setSessions(r.data));
  };

  const addQuestion = async () => {

    if (!q.text || !q.opt_a || !q.opt_b || !q.opt_c || !q.opt_d)
      return alert(t.fillAllFields);
    await axios.post(`${API}/teacher/add_question`, {
      ...q,
      image_url: qImgs.main,
      img_a: qImgs.a,
      img_b: qImgs.b,
      img_c: qImgs.c,
      img_d: qImgs.d,
    });
    setQImgs({ main: "", a: "", b: "", c: "", d: "" });
    setQ({
      ...q,
      text: "",
      opt_a: "",
      opt_b: "",
      opt_c: "",
      opt_d: "",
      hint: "",
    });

    if (!q.text || !q.opt_a || !q.opt_b || !q.opt_c || !q.opt_d) return alert(t.fillAllFields);
    await axios.post(`${API}/teacher/add_question`, { ...q, image_url: qImgs.main, img_a: qImgs.a, img_b: qImgs.b, img_c: qImgs.c, img_d: qImgs.d });
    setQImgs({ main: "", a: "", b: "", c: "", d: "" });
    setQ({ ...q, text: "", opt_a: "", opt_b: "", opt_c: "", opt_d: "", hint: "" });

    alert(t.questionAdded);
  };

  const saveSignOfDay = async () => {

    if (!sotd.word || !sotd.description)
      return alert("Please fill in the word and description.");
    await axios.post(`${API}/teacher/sign_of_day`, {
      ...sotd,
      set_by: user.username,
    });
    setSotd({ word: "", description: "", image_url: "" });
    alert("Sign of the Day updated.");
  };

  const saveDictEntry = async () => {
    if (!dictForm.word || !dictForm.image_url)
      return alert("Word and image are required.");
    await axios.post(`${API}/teacher/dictionary`, dictForm);
    setDictForm({
      word: "",
      category: "Greetings",
      description: "",
      image_url: "",
    });
    alert("Added to dictionary.");

    if (!sotd.word || !sotd.description) return alert("Please fill in the word and description.");
    await axios.post(`${API}/teacher/sign_of_day`, { ...sotd, set_by: user.username });
    setSotd({ word: "", description: "", image_url: "" }); alert("Sign of the Day updated.");
  };

  const saveDictEntry = async () => {
    if (!dictForm.word || !dictForm.image_url) return alert("Word and image are required.");
    await axios.post(`${API}/teacher/dictionary`, dictForm);
    setDictForm({ word: "", category: "Greetings", description: "", image_url: "" }); alert("Added to dictionary.");

  };

  const updateDueDate = async () => {
    if (!dueForm.assignment_no || !dueForm.due_date) return;
    await axios.post(`${API}/teacher/set_due_date`, dueForm);

    setDueMsg("Updated.");
    axios.get(`${API}/sessions`).then((r) => setSessions(r.data));

    setDueMsg("Updated."); axios.get(`${API}/sessions`).then(r => setSessions(r.data));

    setTimeout(() => setDueMsg(""), 2500);
  };

  const TABS = [
    { k: "upload", l: t.uploadTab },
    { k: "quiz", l: t.quizTab },
    { k: "sotd", l: t.sotdTab },
    { k: "dict", l: t.dictTab },
    { k: "schedule", l: t.scheduleTab },
    { k: "stats", l: t.statsTab },
    { k: "leaderboard", l: t.leadersTab },
    { k: "doubts", l: t.doubtsTab },
  ];

  const formSection = (title, children) => (
    <div className="sl-card" style={{ maxWidth: "560px" }}>

      <h2
        className="sl-heading"
        style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}
      >
        {title}
      </h2>

      <h2 className="sl-heading" style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>{title}</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {children}
      </div>
    </div>
  );

  return (
    <>
      <DesignSystem />
      <div className="sl-page">
        <Topbar user={user} role={t.teacher} />

        {/* Tab bar */}

        <div
          style={{
            background: "#fff",
            borderBottom: "1px solid var(--stone-100)",
            padding: "0 1.5rem",
            overflowX: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "0.25rem",
              padding: "0.625rem 0",
              width: "max-content",
            }}
          >
            {TABS.map((tb) => (
              <button
                key={tb.k}
                onClick={() => setTab(tb.k)}
                className={`sl-tab ${tab === tb.k ? "active" : ""}`}
              >

        <div style={{ background: "#fff", borderBottom: "1px solid var(--stone-100)", padding: "0 1.5rem", overflowX: "auto" }}>
          <div style={{ display: "flex", gap: "0.25rem", padding: "0.625rem 0", width: "max-content" }}>
            {TABS.map(tb => (
              <button key={tb.k} onClick={() => setTab(tb.k)}
                className={`sl-tab ${tab === tb.k ? "active" : ""}`}>

                {tb.l}
              </button>
            ))}
          </div>
        </div>

        <div className="sl-container" style={{ padding: "2rem 1.5rem" }}>

          {/* UPLOAD */}
          {tab === "upload" &&
            formSection(
              t.uploadLesson,
              <>
                <div>
                  <label
                    className="sl-label"
                    style={{ display: "block", marginBottom: "0.4rem" }}
                  >
                    {t.assignmentNo}
                  </label>
                  <input
                    type="number"
                    className="sl-input"
                    placeholder="1"
                    onChange={(e) =>
                      setQ({ ...q, assignment_no: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    className="sl-label"
                    style={{ display: "block", marginBottom: "0.4rem" }}
                  >
                    {t.lessonTopic}
                  </label>
                  <input
                    className="sl-input"
                    placeholder={t.lessonTopic}
                    onChange={(e) => setQ({ ...q, topic: e.target.value })}
                  />
                </div>
                <div>
                  <label
                    className="sl-label"
                    style={{ display: "block", marginBottom: "0.4rem" }}
                  >
                    {t.dueDate}
                  </label>
                  <input
                    type="datetime-local"
                    className="sl-input"
                    onChange={(e) => setQ({ ...q, due_date: e.target.value })}
                  />
                </div>
                <div>
                  <label
                    className="sl-label"
                    style={{ display: "block", marginBottom: "0.4rem" }}
                  >
                    Video File
                  </label>
                  <label
                    className="sl-upload-zone"
                    htmlFor="vid-upload"
                    style={{ display: "block" }}
                  >
                    <input
                      type="file"
                      accept=".mp4,.webm"
                      onChange={(e) => setFile(e.target.files[0])}
                      style={{ display: "none" }}
                      id="vid-upload"
                    />
                    <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                      🎬
                    </p>
                    <p
                      style={{
                        color: "var(--stone-500)",
                        fontWeight: 500,
                        fontSize: "0.9375rem",
                        margin: 0,
                      }}
                    >
                      {file ? file.name : t.selectVideo}
                    </p>
                  </label>
                </div>
                <button
                  onClick={uploadVideo}
                  disabled={saving}
                  className="sl-btn sl-btn-primary sl-btn-full"
                >
                  {saving ? t.saving : t.saveLesson}
                </button>
              </>,
            )}


          {/* UPLOAD */}
          {tab === "upload" && formSection(t.uploadLesson, <>
            <div>
              <label className="sl-label" style={{ display: "block", marginBottom: "0.4rem" }}>{t.assignmentNo}</label>
              <input type="number" className="sl-input" placeholder="1"
                onChange={e => setQ({ ...q, assignment_no: e.target.value })} />
            </div>
            <div>
              <label className="sl-label" style={{ display: "block", marginBottom: "0.4rem" }}>{t.lessonTopic}</label>
              <input className="sl-input" placeholder={t.lessonTopic}
                onChange={e => setQ({ ...q, topic: e.target.value })} />
            </div>
            <div>
              <label className="sl-label" style={{ display: "block", marginBottom: "0.4rem" }}>{t.dueDate}</label>
              <input type="datetime-local" className="sl-input"
                onChange={e => setQ({ ...q, due_date: e.target.value })} />
            </div>
            <div>
              <label className="sl-label" style={{ display: "block", marginBottom: "0.4rem" }}>Video File</label>
              <label className="sl-upload-zone" htmlFor="vid-upload" style={{ display: "block" }}>
                <input type="file" accept=".mp4,.webm" onChange={e => setFile(e.target.files[0])} style={{ display: "none" }} id="vid-upload" />
                <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎬</p>
                <p style={{ color: "var(--stone-500)", fontWeight: 500, fontSize: "0.9375rem", margin: 0 }}>
                  {file ? file.name : t.selectVideo}
                </p>
              </label>
            </div>
            <button onClick={uploadVideo} disabled={saving} className="sl-btn sl-btn-primary sl-btn-full">
              {saving ? t.saving : t.saveLesson}
            </button>
          </>)}


          {/* QUIZ CREATOR */}
          {tab === "quiz" && (
            <div className="sl-card" style={{ maxWidth: "640px" }}>

              <h2
                className="sl-heading"
                style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}
              >
                {t.addQuizQuestion}
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.75rem",
                  }}
                >
                  <div>
                    <label
                      className="sl-label"
                      style={{ display: "block", marginBottom: "0.4rem" }}
                    >
                      {t.assignmentNo}
                    </label>
                    <input
                      type="number"
                      className="sl-input"
                      onChange={(e) =>
                        setQ({ ...q, assignment_no: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label
                      className="sl-label"
                      style={{ display: "block", marginBottom: "0.4rem" }}
                    >
                      Difficulty
                    </label>
                    <select
                      className="sl-input"
                      value={q.difficulty}
                      onChange={(e) =>
                        setQ({ ...q, difficulty: e.target.value })
                      }
                    >

              <h2 className="sl-heading" style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>{t.addQuizQuestion}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label className="sl-label" style={{ display: "block", marginBottom: "0.4rem" }}>{t.assignmentNo}</label>
                    <input type="number" className="sl-input" onChange={e => setQ({ ...q, assignment_no: e.target.value })} />
                  </div>
                  <div>
                    <label className="sl-label" style={{ display: "block", marginBottom: "0.4rem" }}>Difficulty</label>
                    <select className="sl-input" value={q.difficulty} onChange={e => setQ({ ...q, difficulty: e.target.value })}>

                      <option value="easy">{t.easy}</option>
                      <option value="medium">{t.medium}</option>
                      <option value="hard">{t.hard}</option>
                    </select>
                  </div>
                </div>
                <div>

                  <label
                    className="sl-label"
                    style={{ display: "block", marginBottom: "0.4rem" }}
                  >
                    {t.questionText}
                  </label>
                  <textarea
                    className="sl-input sl-textarea"
                    rows={3}
                    placeholder={t.questionText}
                    value={q.text}
                    onChange={(e) => setQ({ ...q, text: e.target.value })}
                  />
                </div>
                <div
                  style={{
                    background: "var(--sage-light)",
                    border: "1px solid rgba(92,122,106,0.2)",
                    borderRadius: "var(--radius-md)",
                    padding: "1rem",
                  }}
                >
                  <label
                    className="sl-label"
                    style={{ display: "block", marginBottom: "0.5rem" }}
                  >
                    {t.questionImage}
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        uploadImg(e.target.files[0], "main", setQImgs, setUpImg)
                      }
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--stone-500)",
                        flex: 1,
                      }}
                    />
                    {upImg === "main" && (
                      <span
                        style={{ fontSize: "0.8125rem", color: "var(--sage)" }}
                      >
                        {t.uploading}
                      </span>
                    )}
                    {qImgs.main && (
                      <img
                        src={qImgs.main}
                        style={{
                          width: "3.5rem",
                          height: "3.5rem",
                          borderRadius: "var(--radius-sm)",
                          objectFit: "cover",
                        }}
                        alt=""
                      />
                    )}
                  </div>
                </div>
                <div>
                  <label
                    className="sl-label"
                    style={{ display: "block", marginBottom: "0.4rem" }}
                  >
                    {t.hint}
                  </label>
                  <input
                    className="sl-input"
                    placeholder={t.hint}
                    value={q.hint}
                    onChange={(e) => setQ({ ...q, hint: e.target.value })}
                  />
                </div>
                <div>
                  <p className="sl-label" style={{ marginBottom: "0.75rem" }}>
                    {t.answerOptions}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.625rem",
                    }}
                  >
                    {["a", "b", "c", "d"].map((l) => (
                      <div
                        key={l}
                        style={{
                          background: "var(--cream)",
                          border: "1px solid var(--stone-100)",
                          borderRadius: "var(--radius-md)",
                          padding: "0.875rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <span
                            style={{
                              width: "2rem",
                              height: "2rem",
                              background: "var(--sage-light)",
                              color: "var(--sage-dark)",
                              borderRadius: "var(--radius-sm)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {l.toUpperCase()}
                          </span>
                          <input
                            className="sl-input"
                            style={{ background: "#fff" }}
                            placeholder={`${t.optionText} ${l.toUpperCase()}`}
                            value={q[`opt_${l}`]}
                            onChange={(e) =>
                              setQ({ ...q, [`opt_${l}`]: e.target.value })
                            }
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.625rem",
                            paddingLeft: "2.75rem",
                          }}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              uploadImg(
                                e.target.files[0],
                                l,
                                setQImgs,
                                setUpImg,
                              )
                            }
                            style={{
                              fontSize: "0.8125rem",
                              color: "var(--stone-400)",
                              flex: 1,
                            }}
                          />
                          {upImg === l && (
                            <span
                              style={{
                                fontSize: "0.8125rem",
                                color: "var(--sage)",
                              }}
                            >
                              {t.uploading}
                            </span>
                          )}
                          {qImgs[l] && (
                            <img
                              src={qImgs[l]}
                              style={{
                                width: "2.5rem",
                                height: "2.5rem",
                                borderRadius: "var(--radius-sm)",
                                objectFit: "cover",
                              }}
                              alt=""
                            />
                          )}

                  <label className="sl-label" style={{ display: "block", marginBottom: "0.4rem" }}>{t.questionText}</label>
                  <textarea className="sl-input sl-textarea" rows={3} placeholder={t.questionText}
                    value={q.text} onChange={e => setQ({ ...q, text: e.target.value })} />
                </div>
                <div style={{ background: "var(--sage-light)", border: "1px solid rgba(92,122,106,0.2)", borderRadius: "var(--radius-md)", padding: "1rem" }}>
                  <label className="sl-label" style={{ display: "block", marginBottom: "0.5rem" }}>{t.questionImage}</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <input type="file" accept="image/*" onChange={e => uploadImg(e.target.files[0], "main", setQImgs, setUpImg)}
                      style={{ fontSize: "0.875rem", color: "var(--stone-500)", flex: 1 }} />
                    {upImg === "main" && <span style={{ fontSize: "0.8125rem", color: "var(--sage)" }}>{t.uploading}</span>}
                    {qImgs.main && <img src={qImgs.main} style={{ width: "3.5rem", height: "3.5rem", borderRadius: "var(--radius-sm)", objectFit: "cover" }} alt="" />}
                  </div>
                </div>
                <div>
                  <label className="sl-label" style={{ display: "block", marginBottom: "0.4rem" }}>{t.hint}</label>
                  <input className="sl-input" placeholder={t.hint} value={q.hint}
                    onChange={e => setQ({ ...q, hint: e.target.value })} />
                </div>
                <div>
                  <p className="sl-label" style={{ marginBottom: "0.75rem" }}>{t.answerOptions}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                    {["a", "b", "c", "d"].map(l => (
                      <div key={l} style={{ background: "var(--cream)", border: "1px solid var(--stone-100)", borderRadius: "var(--radius-md)", padding: "0.875rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                          <span style={{ width: "2rem", height: "2rem", background: "var(--sage-light)", color: "var(--sage-dark)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>{l.toUpperCase()}</span>
                          <input className="sl-input" style={{ background: "#fff" }} placeholder={`${t.optionText} ${l.toUpperCase()}`}
                            value={q[`opt_${l}`]} onChange={e => setQ({ ...q, [`opt_${l}`]: e.target.value })} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", paddingLeft: "2.75rem" }}>
                          <input type="file" accept="image/*" onChange={e => uploadImg(e.target.files[0], l, setQImgs, setUpImg)}
                            style={{ fontSize: "0.8125rem", color: "var(--stone-400)", flex: 1 }} />
                          {upImg === l && <span style={{ fontSize: "0.8125rem", color: "var(--sage)" }}>{t.uploading}</span>}
                          {qImgs[l] && <img src={qImgs[l]} style={{ width: "2.5rem", height: "2.5rem", borderRadius: "var(--radius-sm)", objectFit: "cover" }} alt="" />}

                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    background: "var(--sage-light)",
                    border: "1px solid rgba(92,122,106,0.25)",
                    borderRadius: "var(--radius-md)",
                    padding: "1rem",
                  }}
                >
                  <label
                    className="sl-label"
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "var(--sage-dark)",
                    }}
                  >
                    {t.correctAnswer}
                  </label>
                  <select
                    className="sl-input"
                    style={{ background: "#fff" }}
                    value={q.correct_opt}
                    onChange={(e) =>
                      setQ({ ...q, correct_opt: e.target.value })
                    }
                  >
                    {["A", "B", "C", "D"].map((o) => (
                      <option key={o} value={o}>
                        Option {o}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={addQuestion}
                  className="sl-btn sl-btn-primary sl-btn-full"
                >
                  {t.addQuestion}
                </button>

                <div style={{ background: "var(--sage-light)", border: "1px solid rgba(92,122,106,0.25)", borderRadius: "var(--radius-md)", padding: "1rem" }}>
                  <label className="sl-label" style={{ display: "block", marginBottom: "0.5rem", color: "var(--sage-dark)" }}>{t.correctAnswer}</label>
                  <select className="sl-input" style={{ background: "#fff" }} value={q.correct_opt}
                    onChange={e => setQ({ ...q, correct_opt: e.target.value })}>
                    {["A", "B", "C", "D"].map(o => <option key={o} value={o}>Option {o}</option>)}
                  </select>
                </div>
                <button onClick={addQuestion} className="sl-btn sl-btn-primary sl-btn-full">{t.addQuestion}</button>

              </div>
            </div>
          )}

          {/* SIGN OF THE DAY */}

          {tab === "sotd" &&
            formSection(
              t.setSignOfDay,
              <>
                <div>
                  <label
                    className="sl-label"
                    style={{ display: "block", marginBottom: "0.4rem" }}
                  >
                    {t.signWord}
                  </label>
                  <input
                    className="sl-input"
                    placeholder={t.signWord}
                    value={sotd.word}
                    onChange={(e) => setSotd({ ...sotd, word: e.target.value })}
                  />
                </div>
                <div>
                  <label
                    className="sl-label"
                    style={{ display: "block", marginBottom: "0.4rem" }}
                  >
                    {t.signDesc}
                  </label>
                  <textarea
                    className="sl-input sl-textarea"
                    rows={3}
                    placeholder={t.signDesc}
                    value={sotd.description}
                    onChange={(e) =>
                      setSotd({ ...sotd, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    className="sl-label"
                    style={{ display: "block", marginBottom: "0.5rem" }}
                  >
                    {t.addSignImage}
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--stone-500)",
                        flex: 1,
                      }}
                      onChange={async (e) => {
                        setSotdImgLoading(true);
                        const fd = new FormData();
                        fd.append("file", e.target.files[0]);
                        const r = await axios.post(
                          `${API}/teacher/upload_image`,
                          fd,
                        );
                        setSotd((p) => ({ ...p, image_url: r.data.url }));
                        setSotdImgLoading(false);
                      }}
                    />
                    {sotdImgLoading && (
                      <span
                        style={{ fontSize: "0.8125rem", color: "var(--sage)" }}
                      >
                        {t.uploading}
                      </span>
                    )}
                    {sotd.image_url && (
                      <img
                        src={sotd.image_url}
                        style={{
                          width: "4rem",
                          height: "4rem",
                          borderRadius: "var(--radius-md)",
                          objectFit: "cover",
                        }}
                        alt=""
                      />
                    )}
                  </div>
                </div>
                <button
                  onClick={saveSignOfDay}
                  className="sl-btn sl-btn-primary sl-btn-full"
                >
                  {t.saveSign}
                </button>
              </>,
            )}

          {/* DICTIONARY */}
          {tab === "dict" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div className="sl-card" style={{ maxWidth: "520px" }}>
                <h2
                  className="sl-heading"
                  style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}
                >
                  {t.addToDictionary}
                </h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label
                      className="sl-label"
                      style={{ display: "block", marginBottom: "0.4rem" }}
                    >
                      {t.dictWord}
                    </label>
                    <input
                      className="sl-input"
                      placeholder={t.dictWord}
                      value={dictForm.word}
                      onChange={(e) =>
                        setDictForm({ ...dictForm, word: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label
                      className="sl-label"
                      style={{ display: "block", marginBottom: "0.4rem" }}
                    >
                      {t.dictCategory}
                    </label>
                    <select
                      className="sl-input"
                      value={dictForm.category}
                      onChange={(e) =>
                        setDictForm({ ...dictForm, category: e.target.value })
                      }
                    >
                      {[
                        "Greetings",
                        "Numbers",
                        "Colors",
                        "Animals",
                        "Family",
                        "Food",
                        "Actions",
                        "Emotions",
                        "Objects",
                      ].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      className="sl-label"
                      style={{ display: "block", marginBottom: "0.4rem" }}
                    >
                      {t.dictDesc}
                    </label>
                    <input
                      className="sl-input"
                      placeholder={t.dictDesc}
                      value={dictForm.description}
                      onChange={(e) =>
                        setDictForm({
                          ...dictForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label
                      className="sl-label"
                      style={{ display: "block", marginBottom: "0.5rem" }}
                    >
                      {t.dictImage}
                    </label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--stone-500)",
                          flex: 1,
                        }}
                        onChange={async (e) => {
                          setDictImgLoading(true);
                          const fd = new FormData();
                          fd.append("file", e.target.files[0]);
                          const r = await axios.post(
                            `${API}/teacher/upload_image`,
                            fd,
                          );
                          setDictForm((p) => ({ ...p, image_url: r.data.url }));
                          setDictImgLoading(false);
                        }}
                      />
                      {dictImgLoading && (
                        <span
                          style={{
                            fontSize: "0.8125rem",
                            color: "var(--sage)",
                          }}
                        >
                          {t.uploading}
                        </span>
                      )}
                      {dictForm.image_url && (
                        <img
                          src={dictForm.image_url}
                          style={{
                            width: "4rem",
                            height: "4rem",
                            borderRadius: "var(--radius-md)",
                            objectFit: "cover",
                          }}
                          alt=""
                        />
                      )}
                    </div>
                  </div>
                  <button
                    onClick={saveDictEntry}
                    className="sl-btn sl-btn-primary sl-btn-full"
                  >
                    {t.saveDictEntry}
                  </button>
                </div>
              </div>
              <div className="sl-card">
                <h3
                  className="sl-heading"
                  style={{ marginBottom: "1.25rem", fontSize: "1.125rem" }}
                >
                  {t.visualDict}
                </h3>

          {tab === "sotd" && formSection(t.setSignOfDay, <>
            <div>
              <label className="sl-label" style={{ display: "block", marginBottom: "0.4rem" }}>{t.signWord}</label>
              <input className="sl-input" placeholder={t.signWord} value={sotd.word}
                onChange={e => setSotd({ ...sotd, word: e.target.value })} />
            </div>
            <div>
              <label className="sl-label" style={{ display: "block", marginBottom: "0.4rem" }}>{t.signDesc}</label>
              <textarea className="sl-input sl-textarea" rows={3} placeholder={t.signDesc}
                value={sotd.description} onChange={e => setSotd({ ...sotd, description: e.target.value })} />
            </div>
            <div>
              <label className="sl-label" style={{ display: "block", marginBottom: "0.5rem" }}>{t.addSignImage}</label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <input type="file" accept="image/*" style={{ fontSize: "0.875rem", color: "var(--stone-500)", flex: 1 }}
                  onChange={async e => {
                    setSotdImgLoading(true);
                    const fd = new FormData(); fd.append("file", e.target.files[0]);
                    const r = await axios.post(`${API}/teacher/upload_image`, fd);
                    setSotd(p => ({ ...p, image_url: r.data.url })); setSotdImgLoading(false);
                  }} />
                {sotdImgLoading && <span style={{ fontSize: "0.8125rem", color: "var(--sage)" }}>{t.uploading}</span>}
                {sotd.image_url && <img src={sotd.image_url} style={{ width: "4rem", height: "4rem", borderRadius: "var(--radius-md)", objectFit: "cover" }} alt="" />}
              </div>
            </div>
            <button onClick={saveSignOfDay} className="sl-btn sl-btn-primary sl-btn-full">{t.saveSign}</button>
          </>)}

          {/* DICTIONARY */}
          {tab === "dict" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className="sl-card" style={{ maxWidth: "520px" }}>
                <h2 className="sl-heading" style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>{t.addToDictionary}</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label className="sl-label" style={{ display: "block", marginBottom: "0.4rem" }}>{t.dictWord}</label>
                    <input className="sl-input" placeholder={t.dictWord} value={dictForm.word}
                      onChange={e => setDictForm({ ...dictForm, word: e.target.value })} />
                  </div>
                  <div>
                    <label className="sl-label" style={{ display: "block", marginBottom: "0.4rem" }}>{t.dictCategory}</label>
                    <select className="sl-input" value={dictForm.category}
                      onChange={e => setDictForm({ ...dictForm, category: e.target.value })}>
                      {["Greetings", "Numbers", "Colors", "Animals", "Family", "Food", "Actions", "Emotions", "Objects"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="sl-label" style={{ display: "block", marginBottom: "0.4rem" }}>{t.dictDesc}</label>
                    <input className="sl-input" placeholder={t.dictDesc} value={dictForm.description}
                      onChange={e => setDictForm({ ...dictForm, description: e.target.value })} />
                  </div>
                  <div>
                    <label className="sl-label" style={{ display: "block", marginBottom: "0.5rem" }}>{t.dictImage}</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <input type="file" accept="image/*" style={{ fontSize: "0.875rem", color: "var(--stone-500)", flex: 1 }}
                        onChange={async e => {
                          setDictImgLoading(true);
                          const fd = new FormData(); fd.append("file", e.target.files[0]);
                          const r = await axios.post(`${API}/teacher/upload_image`, fd);
                          setDictForm(p => ({ ...p, image_url: r.data.url })); setDictImgLoading(false);
                        }} />
                      {dictImgLoading && <span style={{ fontSize: "0.8125rem", color: "var(--sage)" }}>{t.uploading}</span>}
                      {dictForm.image_url && <img src={dictForm.image_url} style={{ width: "4rem", height: "4rem", borderRadius: "var(--radius-md)", objectFit: "cover" }} alt="" />}
                    </div>
                  </div>
                  <button onClick={saveDictEntry} className="sl-btn sl-btn-primary sl-btn-full">{t.saveDictEntry}</button>
                </div>
              </div>
              <div className="sl-card">
                <h3 className="sl-heading" style={{ marginBottom: "1.25rem", fontSize: "1.125rem" }}>{t.visualDict}</h3>

                <DictionaryViewer />
              </div>
            </div>
          )}

          {/* SCHEDULE */}
          {tab === "schedule" && (

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                maxWidth: "560px",
              }}
            >
              <div className="sl-card">
                <h2
                  className="sl-heading"
                  style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}
                >
                  {t.setDueDate}
                </h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <select
                    className="sl-input"
                    value={dueForm.assignment_no}
                    onChange={(e) =>
                      setDueForm({ ...dueForm, assignment_no: e.target.value })
                    }
                  >
                    <option value="">— Select Lesson —</option>
                    {sessions.map((s) => (
                      <option key={s.id} value={s.ano}>
                        Lesson {s.ano}: {s.title}
                      </option>
                    ))}
                  </select>
                  <input
                    type="datetime-local"
                    className="sl-input"
                    value={dueForm.due_date}
                    onChange={(e) =>
                      setDueForm({ ...dueForm, due_date: e.target.value })
                    }
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.875rem",
                    }}
                  >
                    <button
                      onClick={updateDueDate}
                      className="sl-btn sl-btn-primary"
                    >
                      {t.updateDue}
                    </button>
                    {dueMsg && (
                      <span
                        style={{
                          color: "var(--sage)",
                          fontWeight: 600,
                          fontSize: "0.9375rem",
                        }}
                      >
                        {dueMsg}
                      </span>
                    )}

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "560px" }}>
              <div className="sl-card">
                <h2 className="sl-heading" style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>{t.setDueDate}</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <select className="sl-input" value={dueForm.assignment_no}
                    onChange={e => setDueForm({ ...dueForm, assignment_no: e.target.value })}>
                    <option value="">— Select Lesson —</option>
                    {sessions.map(s => <option key={s.id} value={s.ano}>Lesson {s.ano}: {s.title}</option>)}
                  </select>
                  <input type="datetime-local" className="sl-input" value={dueForm.due_date}
                    onChange={e => setDueForm({ ...dueForm, due_date: e.target.value })} />
                  <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                    <button onClick={updateDueDate} className="sl-btn sl-btn-primary">{t.updateDue}</button>
                    {dueMsg && <span style={{ color: "var(--sage)", fontWeight: 600, fontSize: "0.9375rem" }}>{dueMsg}</span>}

                  </div>
                </div>
              </div>
              <div className="sl-card">

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.625rem",
                  }}
                >
                  {sessions.map((s) => (
                    <div
                      key={s.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.875rem 1rem",
                        background: "var(--cream)",
                        borderRadius: "var(--radius-md)",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                      }}
                    >
                      <p
                        style={{
                          fontWeight: 500,
                          margin: 0,
                          fontSize: "0.9375rem",
                        }}
                      >
                        Lesson {s.ano}: {s.title}
                      </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {sessions.map(s => (
                    <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.875rem 1rem", background: "var(--cream)", borderRadius: "var(--radius-md)", flexWrap: "wrap", gap: "0.5rem" }}>
                      <p style={{ fontWeight: 500, margin: 0, fontSize: "0.9375rem" }}>Lesson {s.ano}: {s.title}</p>

                      <CountdownBadge dueDate={s.due_date} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STATS */}
          {tab === "stats" && (
            <div style={{ maxWidth: "720px" }}>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  marginBottom: "1.5rem",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "var(--rose)",
                    display: "inline-block",
                    animation: "pulse 2s infinite",
                  }}
                />
                <p className="sl-label">{t.liveProgress}</p>
              </div>
              <style>{`@keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }`}</style>
              {stats.length === 0 ? (
                <div className="sl-empty">
                  <div className="sl-empty-icon">📊</div>
                  <p>{t.noResults}</p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    maxHeight: "600px",
                    overflowY: "auto",
                  }}
                >
                  {stats.map((s, i) => (
                    <div
                      key={i}
                      className="sl-card"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontWeight: 600,
                            fontSize: "1rem",
                            margin: "0 0 0.2rem",
                          }}
                        >
                          {s.name}
                        </p>
                        <p
                          style={{
                            fontSize: "0.8125rem",
                            color: "var(--stone-400)",
                            margin: "0 0 0.3rem",
                            fontWeight: 500,
                          }}
                        >
                          {s.topic}
                        </p>
                        <p
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--sage)",
                            fontStyle: "italic",
                            margin: 0,
                          }}
                        >
                          {s.suggestion}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            gap: "1rem",
                            marginTop: "0.3rem",
                          }}
                        >
                          {s.time_taken && (
                            <span
                              style={{
                                fontSize: "0.75rem",
                                color: "var(--stone-400)",
                                fontWeight: 500,
                              }}
                            >
                              ⏱ {Math.floor(s.time_taken / 60)}m{" "}
                              {s.time_taken % 60}s
                            </span>
                          )}
                          {s.attempt_no > 1 && (
                            <span
                              style={{
                                fontSize: "0.75rem",
                                color: "var(--stone-400)",
                                fontWeight: 500,
                              }}
                            >
                              Attempt #{s.attempt_no}
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p
                          style={{
                            fontFamily: "var(--font-serif)",
                            fontSize: "2.25rem",
                            margin: 0,
                            color:
                              s.score >= 70 ? "var(--sage)" : "var(--rose)",
                          }}
                        >
                          {s.score}%
                        </p>
                        <p
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color:
                              s.score >= 70 ? "var(--sage)" : "var(--rose)",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            margin: 0,
                          }}
                        >
                          {s.prediction}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.5rem" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--rose)", display: "inline-block", animation: "pulse 2s infinite" }} />
                <p className="sl-label">{t.liveProgress}</p>
              </div>
              <style>{`@keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }`}</style>
              {stats.length === 0
                ? <div className="sl-empty"><div className="sl-empty-icon">📊</div><p>{t.noResults}</p></div>
                : <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "600px", overflowY: "auto" }}>
                  {stats.map((s, i) => (
                    <div key={i} className="sl-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "1rem", margin: "0 0 0.2rem" }}>{s.name}</p>
                        <p style={{ fontSize: "0.8125rem", color: "var(--stone-400)", margin: "0 0 0.3rem", fontWeight: 500 }}>{s.topic}</p>
                        <p style={{ fontSize: "0.875rem", color: "var(--sage)", fontStyle: "italic", margin: 0 }}>{s.suggestion}</p>
                        <div style={{ display: "flex", gap: "1rem", marginTop: "0.3rem" }}>
                          {s.time_taken && <span style={{ fontSize: "0.75rem", color: "var(--stone-400)", fontWeight: 500 }}>⏱ {Math.floor(s.time_taken / 60)}m {s.time_taken % 60}s</span>}
                          {s.attempt_no > 1 && <span style={{ fontSize: "0.75rem", color: "var(--stone-400)", fontWeight: 500 }}>Attempt #{s.attempt_no}</span>}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontFamily: "var(--font-serif)", fontSize: "2.25rem", margin: 0, color: s.score >= 70 ? "var(--sage)" : "var(--rose)" }}>{s.score}%</p>
                        <p style={{ fontSize: "0.75rem", fontWeight: 600, color: s.score >= 70 ? "var(--sage)" : "var(--rose)", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>{s.prediction}</p>
                      </div>
                    </div>
                  ))}
                </div>}

            </div>
          )}

          {/* LEADERBOARD */}
          {tab === "leaderboard" && (
            <div style={{ maxWidth: "560px" }}>

              <h2 className="sl-heading" style={{ marginBottom: "1.5rem" }}>
                {t.classLeaderboard}
              </h2>
              {lb.length === 0 ? (
                <div className="sl-empty">
                  <div className="sl-empty-icon">🏆</div>
                  <p>{t.noData}</p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.625rem",
                  }}
                >
                  {lb.map((s, i) => (
                    <div
                      key={i}
                      className={`sl-card ${i < 3 ? `sl-rank-${i + 1}` : ""}`}
                      style={{
                        border: `1px solid ${i === 0 ? "#D4AD6A" : i === 1 ? "#9E9EB2" : i === 2 ? "#C4956A" : "var(--stone-100)"}`,
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1.5rem",
                          width: "2rem",
                          textAlign: "center",
                        }}
                      >
                        {i === 0
                          ? "🥇"
                          : i === 1
                            ? "🥈"
                            : i === 2
                              ? "🥉"
                              : `#${i + 1}`}
                      </span>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontWeight: 600,
                            margin: "0 0 0.15rem",
                            fontSize: "1rem",
                          }}
                        >
                          {s.name}
                        </p>
                        <p
                          style={{
                            fontSize: "0.8125rem",
                            color: "var(--stone-500)",
                            margin: 0,
                          }}
                        >
                          {s.quizzes_taken} {t.quizzesTaken}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p
                          style={{
                            fontFamily: "var(--font-serif)",
                            fontSize: "1.5rem",
                            color: "var(--sage)",
                            margin: 0,
                          }}
                        >
                          {s.avg_score}%
                        </p>
                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--stone-400)",
                            margin: 0,
                          }}
                        >
                          {t.best}: {s.best_score}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <h2 className="sl-heading" style={{ marginBottom: "1.5rem" }}>{t.classLeaderboard}</h2>
              {lb.length === 0
                ? <div className="sl-empty"><div className="sl-empty-icon">🏆</div><p>{t.noData}</p></div>
                : <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {lb.map((s, i) => (
                    <div key={i} className={`sl-card ${i < 3 ? `sl-rank-${i + 1}` : ""}`}
                      style={{ border: `1px solid ${i === 0 ? "#D4AD6A" : i === 1 ? "#9E9EB2" : i === 2 ? "#C4956A" : "var(--stone-100)"}`, display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{ fontSize: "1.5rem", width: "2rem", textAlign: "center" }}>
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                      </span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, margin: "0 0 0.15rem", fontSize: "1rem" }}>{s.name}</p>
                        <p style={{ fontSize: "0.8125rem", color: "var(--stone-500)", margin: 0 }}>{s.quizzes_taken} {t.quizzesTaken}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--sage)", margin: 0 }}>{s.avg_score}%</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--stone-400)", margin: 0 }}>{t.best}: {s.best_score}%</p>
                      </div>
                    </div>
                  ))}
                </div>}

            </div>
          )}

          {/* DOUBTS */}
          {tab === "doubts" && (
            <div style={{ maxWidth: "640px" }}>

              <h2 className="sl-heading" style={{ marginBottom: "1.5rem" }}>
                {t.allDoubts}
              </h2>

              <h2 className="sl-heading" style={{ marginBottom: "1.5rem" }}>{t.allDoubts}</h2>

              <DoubtBox ano={null} username={user.username} isTeacher={true} />
            </div>
          )}
        </div>
      </div>
    </>
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
    axios.get(`${API}/sessions`).then((r) => setVids(r.data));
    axios
      .get(`${API}/student/history/${user.username}`)
      .then((r) => setHistory(r.data));
    axios
      .get(`${API}/student/bookmarks/${user.username}`)
      .then((r) => setBM(r.data.map((b) => b.id)));
    axios
      .get(`${API}/student/badges/${user.username}`)
      .then((r) => setBadges(r.data));
    axios.get(`${API}/badges/all`).then((r) => setAllBadgeDefs(r.data));
    socket.on("new_badge", ({ student, badge }) => {
      if (student === user.username) {
        setBadges((p) => [...p, badge]);
        setNewBadgePopup(badge);
        setTimeout(() => setNewBadgePopup(null), 4000);
      }
    });
    return () => socket.off("new_badge");
  }, []);

  const toggleBM = async (id) => {
    const r = await axios.post(`${API}/student/bookmark`, {
      username: user.username,
      session_id: id,
    });
    setBM((prev) =>
      r.data.bookmarked ? [...prev, id] : prev.filter((x) => x !== id),
    );
  };

  const filtered = vids.filter(
    (v) =>
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      String(v.ano).includes(search),
  );
  const avgScore =
    history.length > 0
      ? Math.round(history.reduce((a, b) => a + b.score, 0) / history.length)
      : 0;
  const earnedKeys = new Set(badges.map((b) => b.key));

  const TABS = [
    { k: "lessons", l: t.lessonsTab },
    { k: "history", l: t.historyTab },
    { k: "badges", l: t.badgesTab },
    { k: "dict", l: t.myDictTab },
  ];

  return (
    <>
      <DesignSystem />
      <div className="sl-page">
        {activeQuiz && (

          <QuizOverlay
            user={user}
            topic={activeQuiz.title}
            ano={activeQuiz.ano}
            onClose={(tip) => {
              if (tip) setTip(tip);
              setAQ(null);
              axios
                .get(`${API}/student/history/${user.username}`)
                .then((r) => setHistory(r.data));
            }}
          />

          <QuizOverlay user={user} topic={activeQuiz.title} ano={activeQuiz.ano}
            onClose={tip => { if (tip) setTip(tip); setAQ(null); axios.get(`${API}/student/history/${user.username}`).then(r => setHistory(r.data)); }} />

        )}
        {newBadgePopup && (
          <div className="sl-notification">
            <span style={{ fontSize: "2rem" }}>{newBadgePopup.emoji}</span>
            <div>

              <p style={{ fontWeight: 700, margin: "0 0 0.15rem" }}>
                Achievement unlocked!
              </p>
              <p style={{ fontSize: "0.875rem", opacity: 0.8, margin: 0 }}>
                {newBadgePopup.label}
              </p>

              <p style={{ fontWeight: 700, margin: "0 0 0.15rem" }}>Achievement unlocked!</p>
              <p style={{ fontSize: "0.875rem", opacity: 0.8, margin: 0 }}>{newBadgePopup.label}</p>

            </div>
          </div>
        )}

        <Topbar user={user} />

        <div className="sl-container" style={{ padding: "1.5rem" }}>
          {/* Stats */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>

            {[
              { label: t.lessonsAvailable, value: vids.length, icon: "📹" },
              { label: t.quizzesDone, value: history.length, icon: "✅" },
              { label: t.avgScore, value: `${avgScore}%`, icon: "⭐" },

            ].map((s) => (
              <div
                key={s.label}
                className="sl-card sl-stat"
                style={{ padding: "1.25rem" }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                  {s.icon}
                </div>

            ].map(s => (
              <div key={s.label} className="sl-card sl-stat" style={{ padding: "1.25rem" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{s.icon}</div>

                <p className="sl-stat-value">{s.value}</p>
                <p className="sl-stat-label">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Sign of the Day */}
          <SignOfDayCard />

          {/* Teacher tip */}
          {tip && (

            <div
              style={{
                background: "var(--sage-light)",
                border: "1px solid var(--sage-mid)",
                borderRadius: "var(--radius-lg)",
                padding: "1.125rem 1.25rem",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.875rem",
                marginBottom: "1.25rem",
              }}
            >
              <span
                style={{
                  color: "var(--sage)",
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                  flexShrink: 0,
                  paddingTop: "0.1rem",
                }}
              >
                {t.teachersTip}
              </span>
              <p
                style={{
                  color: "var(--sage-dark)",
                  fontWeight: 500,
                  margin: 0,
                  fontSize: "0.9375rem",
                  flex: 1,
                }}
              >
                {tip}
              </p>
              <button
                onClick={() => setTip(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--stone-400)",
                  cursor: "pointer",
                  fontSize: "1rem",
                  flexShrink: 0,
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Badge teaser */}
          {badges.length > 0 && (
            <div
              style={{
                background: "var(--amber-light)",
                border: "1px solid rgba(196,135,74,0.25)",
                borderRadius: "var(--radius-lg)",
                padding: "0.875rem 1.125rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.25rem",
                cursor: "pointer",
              }}
              onClick={() => setTab("badges")}
              role="button"
              tabIndex={0}
            >
              <div style={{ display: "flex", gap: "0.25rem" }}>
                {badges.slice(0, 5).map((b) => (
                  <span key={b.key} style={{ fontSize: "1.5rem" }}>
                    {b.emoji}
                  </span>
                ))}
              </div>
              <p
                style={{
                  fontWeight: 600,
                  color: "var(--amber)",
                  margin: 0,
                  fontSize: "0.9375rem",
                  flex: 1,
                }}
              >
                {badges.length} achievement{badges.length !== 1 ? "s" : ""}{" "}
                earned
              </p>
              <span style={{ color: "var(--amber)", fontWeight: 700 }}>→</span>
            </div>
          )}

          {/* Tabs */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div className="sl-tabs">
              {TABS.map((tb) => (
                <button
                  key={tb.k}
                  onClick={() => setTab(tb.k)}
                  className={`sl-tab ${tab === tb.k ? "active" : ""}`}
                >
                  {tb.l}
                </button>
              ))}
            </div>
          </div>

          {/* LESSONS */}
          {tab === "lessons" && (
            <>
              <input
                className="sl-input"
                style={{ marginBottom: "1.25rem" }}
                placeholder={t.searchLessons}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {filtered.length === 0 ? (
                <div className="sl-empty">
                  <div className="sl-empty-icon">📭</div>
                  <p>{search ? t.noSearchResults : t.noLessons}</p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                    paddingBottom: "2rem",
                  }}
                >
                  {filtered.map((v, i) => (
                    <div
                      key={i}
                      className="sl-card"
                      style={{ padding: 0, overflow: "hidden" }}
                    >
                      {/* Lesson header */}
                      <div
                        style={{
                          padding: "1.25rem 1.5rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          flexWrap: "wrap",
                          gap: "1rem",
                          borderBottom: "1px solid var(--stone-100)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "1rem",
                          }}
                        >
                          <div
                            style={{
                              width: "3rem",
                              height: "3rem",
                              background: "var(--sage)",
                              color: "#fff",
                              borderRadius: "var(--radius-md)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily: "var(--font-serif)",
                              fontSize: "1.25rem",
                              flexShrink: 0,
                            }}
                          >
                            {v.ano}
                          </div>
                          <div>
                            <h2
                              style={{
                                fontFamily: "var(--font-serif)",
                                fontSize: "1.2rem",
                                margin: "0 0 0.2rem",
                                fontWeight: 400,
                              }}
                            >
                              {v.title}
                            </h2>
                            {v.description && (
                              <p
                                style={{
                                  fontSize: "0.875rem",
                                  color: "var(--stone-500)",
                                  margin: "0 0 0.4rem",
                                }}
                              >
                                {v.description}
                              </p>
                            )}
                            {v.due_date && (
                              <CountdownBadge dueDate={v.due_date} />
                            )}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.625rem",
                          }}
                        >
                          <button
                            onClick={() => toggleBM(v.id)}
                            aria-label={
                              bookmarks.includes(v.id)
                                ? "Remove bookmark"
                                : "Bookmark this lesson"
                            }
                            style={{
                              background: "none",
                              border: "none",
                              fontSize: "1.25rem",
                              cursor: "pointer",
                              color: bookmarks.includes(v.id)
                                ? "var(--amber)"
                                : "var(--stone-300)",
                              transition: "color 0.15s",
                            }}
                          >
                            {bookmarks.includes(v.id) ? "🔖" : "🔖"}
                          </button>
                          <button
                            onClick={() => setAQ(v)}
                            className="sl-btn sl-btn-primary"
                          >
                            {t.startTest}
                          </button>
                        </div>
                      </div>

                      {/* Video */}
                      <div
                        style={{
                          padding: "1.25rem",
                          background: "var(--cream)",
                        }}
                      >
                        <div className="sl-video-wrap">
                          <video controls src={v.url} />
                        </div>
                        <p
                          style={{
                            textAlign: "center",
                            marginTop: "0.75rem",
                            fontSize: "0.875rem",
                            color: "var(--stone-400)",
                            fontWeight: 500,
                          }}
                        >
                          {t.watchThenQuiz}
                        </p>
                      </div>

                      {/* Doubt Box */}
                      <div style={{ borderTop: "1px solid var(--stone-100)" }}>
                        <button
                          onClick={() =>
                            setOD(openDoubt === v.ano ? null : v.ano)
                          }
                          style={{
                            width: "100%",
                            padding: "1rem 1.5rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--stone-600)",
                            fontWeight: 600,
                            fontSize: "0.9375rem",
                            transition: "background 0.15s",
                          }}
                        >
                          <span>{t.doubtBox}</span>
                          <span
                            style={{
                              color: "var(--stone-300)",
                              fontSize: "0.75rem",
                            }}
                          >
                            {openDoubt === v.ano ? "▲" : "▼"}
                          </span>
                        </button>
                        {openDoubt === v.ano && (
                          <div style={{ padding: "0 1.5rem 1.5rem" }}>
                            <DoubtBox
                              ano={v.ano}
                              username={user.username}
                              isTeacher={false}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* HISTORY */}
          {tab === "history" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.625rem",
                paddingBottom: "2rem",
              }}
            >
              {history.length === 0 ? (
                <div className="sl-empty">
                  <div className="sl-empty-icon">📈</div>
                  <p>{t.noHistory}</p>
                </div>
              ) : (
                history.map((h, i) => (
                  <div
                    key={i}
                    className="sl-card"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontWeight: 600,
                          fontSize: "1rem",
                          margin: "0 0 0.2rem",
                        }}
                      >
                        {h.topic}
                      </p>
                      <p
                        style={{
                          fontSize: "0.8125rem",
                          color: "var(--stone-400)",
                          margin: "0 0 0.2rem",
                          fontWeight: 500,
                        }}
                      >
                        {h.created_at} · {t.attempt} #{h.attempt_no}
                      </p>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--sage)",
                          fontStyle: "italic",
                          margin: 0,
                        }}
                      >
                        {h.prediction}
                      </p>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "2rem",
                        color:
                          h.score >= 70
                            ? "var(--sage)"
                            : h.score >= 40
                              ? "var(--amber)"
                              : "var(--rose)",
                      }}
                    >
                      {h.score}%
                    </span>
                  </div>
                ))
              )}
            </div>
          )}


            <div style={{
              background: "var(--sage-light)", border: "1px solid var(--sage-mid)",
              borderRadius: "var(--radius-lg)", padding: "1.125rem 1.25rem",
              display: "flex", alignItems: "flex-start", gap: "0.875rem", marginBottom: "1.25rem"
            }}>
              <span style={{ color: "var(--sage)", fontWeight: 700, fontSize: "0.8125rem", flexShrink: 0, paddingTop: "0.1rem" }}>{t.teachersTip}</span>
              <p style={{ color: "var(--sage-dark)", fontWeight: 500, margin: 0, fontSize: "0.9375rem", flex: 1 }}>{tip}</p>
              <button onClick={() => setTip(null)} style={{ background: "none", border: "none", color: "var(--stone-400)", cursor: "pointer", fontSize: "1rem", flexShrink: 0 }}>✕</button>
            </div>
          )}

          {/* Badge teaser */}
          {badges.length > 0 && (
            <div style={{
              background: "var(--amber-light)", border: "1px solid rgba(196,135,74,0.25)",
              borderRadius: "var(--radius-lg)", padding: "0.875rem 1.125rem",
              display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem",
              cursor: "pointer"
            }} onClick={() => setTab("badges")} role="button" tabIndex={0}>
              <div style={{ display: "flex", gap: "0.25rem" }}>{badges.slice(0, 5).map(b => <span key={b.key} style={{ fontSize: "1.5rem" }}>{b.emoji}</span>)}</div>
              <p style={{ fontWeight: 600, color: "var(--amber)", margin: 0, fontSize: "0.9375rem", flex: 1 }}>
                {badges.length} achievement{badges.length !== 1 ? "s" : ""} earned
              </p>
              <span style={{ color: "var(--amber)", fontWeight: 700 }}>→</span>
            </div>
          )}

          {/* Tabs */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div className="sl-tabs">
              {TABS.map(tb => (
                <button key={tb.k} onClick={() => setTab(tb.k)} className={`sl-tab ${tab === tb.k ? "active" : ""}`}>
                  {tb.l}
                </button>
              ))}
            </div>
          </div>

          {/* LESSONS */}
          {tab === "lessons" && (
            <>
              <input className="sl-input" style={{ marginBottom: "1.25rem" }}
                placeholder={t.searchLessons} value={search} onChange={e => setSearch(e.target.value)} />
              {filtered.length === 0
                ? <div className="sl-empty"><div className="sl-empty-icon">📭</div><p>{search ? t.noSearchResults : t.noLessons}</p></div>
                : <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", paddingBottom: "2rem" }}>
                  {filtered.map((v, i) => (
                    <div key={i} className="sl-card" style={{ padding: 0, overflow: "hidden" }}>
                      {/* Lesson header */}
                      <div style={{
                        padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between",
                        alignItems: "flex-start", flexWrap: "wrap", gap: "1rem",
                        borderBottom: "1px solid var(--stone-100)"
                      }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                          <div style={{
                            width: "3rem", height: "3rem", background: "var(--sage)",
                            color: "#fff", borderRadius: "var(--radius-md)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "var(--font-serif)", fontSize: "1.25rem", flexShrink: 0
                          }}>{v.ano}</div>
                          <div>
                            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", margin: "0 0 0.2rem", fontWeight: 400 }}>{v.title}</h2>
                            {v.description && <p style={{ fontSize: "0.875rem", color: "var(--stone-500)", margin: "0 0 0.4rem" }}>{v.description}</p>}
                            {v.due_date && <CountdownBadge dueDate={v.due_date} />}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                          <button onClick={() => toggleBM(v.id)}
                            aria-label={bookmarks.includes(v.id) ? "Remove bookmark" : "Bookmark this lesson"}
                            style={{ background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer", color: bookmarks.includes(v.id) ? "var(--amber)" : "var(--stone-300)", transition: "color 0.15s" }}>
                            {bookmarks.includes(v.id) ? "🔖" : "🔖"}
                          </button>
                          <button onClick={() => setAQ(v)} className="sl-btn sl-btn-primary">
                            {t.startTest}
                          </button>
                        </div>
                      </div>

                      {/* Video */}
                      <div style={{ padding: "1.25rem", background: "var(--cream)" }}>
                        <div className="sl-video-wrap">
                          <video controls src={v.url} />
                        </div>
                        <p style={{ textAlign: "center", marginTop: "0.75rem", fontSize: "0.875rem", color: "var(--stone-400)", fontWeight: 500 }}>
                          {t.watchThenQuiz}
                        </p>
                      </div>

                      {/* Doubt Box */}
                      <div style={{ borderTop: "1px solid var(--stone-100)" }}>
                        <button
                          onClick={() => setOD(openDoubt === v.ano ? null : v.ano)}
                          style={{
                            width: "100%", padding: "1rem 1.5rem",
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            background: "none", border: "none", cursor: "pointer",
                            color: "var(--stone-600)", fontWeight: 600, fontSize: "0.9375rem",
                            transition: "background 0.15s"
                          }}>
                          <span>{t.doubtBox}</span>
                          <span style={{ color: "var(--stone-300)", fontSize: "0.75rem" }}>{openDoubt === v.ano ? "▲" : "▼"}</span>
                        </button>
                        {openDoubt === v.ano && (
                          <div style={{ padding: "0 1.5rem 1.5rem" }}>
                            <DoubtBox ano={v.ano} username={user.username} isTeacher={false} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>}
            </>
          )}

          {/* HISTORY */}
          {tab === "history" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", paddingBottom: "2rem" }}>
              {history.length === 0
                ? <div className="sl-empty"><div className="sl-empty-icon">📈</div><p>{t.noHistory}</p></div>
                : history.map((h, i) => (
                  <div key={i} className="sl-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "1rem", margin: "0 0 0.2rem" }}>{h.topic}</p>
                      <p style={{ fontSize: "0.8125rem", color: "var(--stone-400)", margin: "0 0 0.2rem", fontWeight: 500 }}>{h.created_at} · {t.attempt} #{h.attempt_no}</p>
                      <p style={{ fontSize: "0.875rem", color: "var(--sage)", fontStyle: "italic", margin: 0 }}>{h.prediction}</p>
                    </div>
                    <span style={{
                      fontFamily: "var(--font-serif)", fontSize: "2rem",
                      color: h.score >= 70 ? "var(--sage)" : h.score >= 40 ? "var(--amber)" : "var(--rose)"
                    }}>{h.score}%</span>
                  </div>
                ))}
            </div>
          )}


          {/* BADGES */}
          {tab === "badges" && (
            <div style={{ paddingBottom: "2rem" }}>
              {badges.length === 0 && (

                <div
                  style={{
                    background: "var(--amber-light)",
                    border: "1px solid rgba(196,135,74,0.2)",
                    borderRadius: "var(--radius-lg)",
                    padding: "2rem",
                    textAlign: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎖️</p>
                  <p
                    style={{
                      color: "var(--amber)",
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    {t.noBadges}
                  </p>

                <div style={{ background: "var(--amber-light)", border: "1px solid rgba(196,135,74,0.2)", borderRadius: "var(--radius-lg)", padding: "2rem", textAlign: "center", marginBottom: "1.5rem" }}>
                  <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎖️</p>
                  <p style={{ color: "var(--amber)", fontWeight: 600, margin: 0 }}>{t.noBadges}</p>

                </div>
              )}
              {badges.length > 0 && (
                <div style={{ marginBottom: "2rem" }}>

                  <p className="sl-label" style={{ marginBottom: "1rem" }}>
                    {t.myBadges} ({badges.length})
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(160px, 1fr))",
                      gap: "1rem",
                    }}
                  >
                    {badges.map((b) => (
                      <BadgeCard key={b.key} badge={b} />
                    ))}
                  </div>
                </div>
              )}
              <p className="sl-label" style={{ marginBottom: "1rem" }}>
                {t.allBadges}
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                  gap: "1rem",
                }}
              >
                {allBadgeDefs
                  .filter((b) => !earnedKeys.has(b.key))
                  .map((b) => (
                    <BadgeCard key={b.key} badge={b} locked={true} />
                  ))}

                  <p className="sl-label" style={{ marginBottom: "1rem" }}>{t.myBadges} ({badges.length})</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem" }}>
                    {badges.map(b => <BadgeCard key={b.key} badge={b} />)}
                  </div>
                </div>
              )}
              <p className="sl-label" style={{ marginBottom: "1rem" }}>{t.allBadges}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem" }}>
                {allBadgeDefs.filter(b => !earnedKeys.has(b.key)).map(b => <BadgeCard key={b.key} badge={b} locked={true} />)}

              </div>
            </div>
          )}

          {/* DICTIONARY */}
          {tab === "dict" && (
            <div style={{ paddingBottom: "2rem" }}>

              <h2 className="sl-heading" style={{ marginBottom: "1.25rem" }}>
                {t.visualDict}
              </h2>

              <h2 className="sl-heading" style={{ marginBottom: "1.25rem" }}>{t.visualDict}</h2>

              <DictionaryViewer />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [auth, setAuth] = useState(() => {
    const s = localStorage.getItem("user");
    return s ? JSON.parse(s) : { loggedIn: false };
  });
  return (
    <LangProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              auth.loggedIn ? (
                <Navigate to={`/${auth.role}`} />
              ) : (
                <Auth setAuth={setAuth} />
              )
            }
          />
          <Route
            path="/teacher"
            element={
              auth.loggedIn && auth.role === "teacher" ? (
                <TeacherView user={auth} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/student"
            element={
              auth.loggedIn && auth.role === "student" ? (
                <StudentView user={auth} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </Router>
    </LangProvider>
  );
}
