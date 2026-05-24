import os
import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_socketio import SocketIO
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
ALLOWED_VIDEO = {'mp4', 'webm'}
ALLOWED_IMAGE = {'jpg', 'jpeg', 'png', 'gif', 'webp'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///signlearn_final.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024

CORS(app)
db = SQLAlchemy(app)
socektio = SocketIO(app, cors_allowed_origins="*")

def allowed_file(filename, allowed_set):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_set

# ─── MODELS ───────────────────────────────────────────────────────────────────
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(256))
    role = db.Column(db.String(20))

class Session(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    assignment_no = db.Column(db.Integer)
    title = db.Column(db.String(100))
    filename = db.Column(db.String(200))
    description = db.Column(db.String(500), nullable=True)
    due_date = db.Column(db.DateTime, nullable=True)

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    assignment_no = db.Column(db.Integer)
    text = db.Column(db.String(300))
    image_url = db.Column(db.String(500), nullable=True)
    opt_a = db.Column(db.String(200))
    opt_b = db.Column(db.String(200))
    opt_c = db.Column(db.String(200))
    opt_d = db.Column(db.String(200))
    img_a = db.Column(db.String(500), nullable=True)
    img_b = db.Column(db.String(500), nullable=True)
    img_c = db.Column(db.String(500), nullable=True)
    img_d = db.Column(db.String(500), nullable=True)
    correct_opt = db.Column(db.String(1))
    hint = db.Column(db.String(300), nullable=True)
    difficulty = db.Column(db.String(20), default='medium')

class QuizResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_name = db.Column(db.String(80))
    topic = db.Column(db.String(100))
    score = db.Column(db.Integer)
    prediction = db.Column(db.String(50))
    suggestion = db.Column(db.String(300))
    time_taken = db.Column(db.Integer, nullable=True)
    attempt_no = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

class Bookmark(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_name = db.Column(db.String(80))
    session_id = db.Column(db.Integer)

class Doubt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_name = db.Column(db.String(80))
    assignment_no = db.Column(db.Integer)
    question = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    replies = db.relationship('DoubtReply', backref='doubt', lazy=True, cascade='all, delete-orphan')

class DoubtReply(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    doubt_id = db.Column(db.Integer, db.ForeignKey('doubt.id'), nullable=False)
    author = db.Column(db.String(80))
    body = db.Column(db.String(1000))
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

# ── NEW: Sign of the Day ──────────────────────────────────────────────────────
class SignOfDay(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(100))
    description = db.Column(db.String(500))
    image_url = db.Column(db.String(500), nullable=True)
    date_set = db.Column(db.Date, default=datetime.date.today)
    set_by = db.Column(db.String(80))

# ── NEW: Visual Dictionary ────────────────────────────────────────────────────
class DictionaryEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(100))
    category = db.Column(db.String(50), default='General')
    description = db.Column(db.String(300), nullable=True)
    image_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

# ── NEW: Badges ───────────────────────────────────────────────────────────────
class Badge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_name = db.Column(db.String(80))
    badge_key = db.Column(db.String(50))   # e.g. 'first_quiz', 'perfect_score'
    earned_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

with app.app_context():
    db.create_all()

# ─── BADGE DEFINITIONS ────────────────────────────────────────────────────────
BADGE_DEFS = {
    'first_quiz':    {'label': 'First Steps!',    'emoji': '👶', 'desc': 'Completed your first quiz'},
    'perfect_score': {'label': 'Perfect! 100%',   'emoji': '🏆', 'desc': 'Scored 100% on a quiz'},
    'high_scorer':   {'label': 'Star Learner',    'emoji': '⭐', 'desc': 'Scored 90%+ on a quiz'},
    'quiz_5':        {'label': 'Quiz Champion',   'emoji': '🎯', 'desc': 'Completed 5 quizzes'},
    'quiz_10':       {'label': 'Quiz Master',     'emoji': '🎓', 'desc': 'Completed 10 quizzes'},
    'comeback':      {'label': 'Never Give Up!',  'emoji': '💪', 'desc': 'Retried a quiz and improved'},
    'bookworm':      {'label': 'Bookmarker',      'emoji': '🔖', 'desc': 'Bookmarked 3 lessons'},
}

def award_badge(student_name, badge_key):
    exists = Badge.query.filter_by(student_name=student_name, badge_key=badge_key).first()
    if not exists:
        db.session.add(Badge(student_name=student_name, badge_key=badge_key))
        db.session.commit()
        socketio.emit('new_badge', {
            'student': student_name,
            'badge': {**BADGE_DEFS[badge_key], 'key': badge_key}
        })
        return True
    return False

def check_and_award_badges(student_name, score, topic):
    total = QuizResult.query.filter_by(student_name=student_name).count()
    if total == 1:
        award_badge(student_name, 'first_quiz')
    if score == 100:
        award_badge(student_name, 'perfect_score')
    if score >= 90:
        award_badge(student_name, 'high_scorer')
    if total >= 5:
        award_badge(student_name, 'quiz_5')
    if total >= 10:
        award_badge(student_name, 'quiz_10')
    # comeback: check if previous attempt on same topic was lower
    prev = QuizResult.query.filter_by(student_name=student_name, topic=topic)\
        .order_by(QuizResult.id.desc()).offset(1).first()
    if prev and score > prev.score:
        award_badge(student_name, 'comeback')

# ─── ANALYZER ─────────────────────────────────────────────────────────────────
def get_analysis(score):
    if score == 100:
        return {"pred": "Perfect Score! 🏆", "sugg": "Absolutely flawless! You are a true Sign Language master.", "color": "gold", "emoji": "🏆", "xp": 100}
    elif score >= 90:
        return {"pred": "Exceptional Mastery", "sugg": "Outstanding! You've mastered these signs perfectly. Try teaching someone else!", "color": "green", "emoji": "🌟", "xp": 90}
    elif score >= 70:
        return {"pred": "Strong Progress", "sugg": "Great job! Watch the video once more to fix small errors. You're almost there!", "color": "blue", "emoji": "💪", "xp": 70}
    elif score >= 40:
        return {"pred": "Developing", "sugg": "Good effort! Spend 5 more minutes with the video and try again. Practice makes perfect!", "color": "orange", "emoji": "📚", "xp": 40}
    else:
        return {"pred": "Needs Review", "sugg": "Don't give up! Let's watch the video together again carefully. You can do this!", "color": "red", "emoji": "❤️", "xp": 10}

# ─── AUTH ──────────────────────────────────────────────────────────────────────
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if not data.get('username') or not data.get('password'):
        return jsonify({"error": "Username and password required"}), 400
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "User already exists"}), 400
    user = User(username=data['username'], password=generate_password_hash(data['password']), role=data['role'])
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "Success"})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({"error": "Invalid login"}), 401
    return jsonify({"role": user.role, "username": user.username})

# ─── TEACHER ROUTES ────────────────────────────────────────────────────────────
@app.route('/teacher/upload', methods=['POST'])
def upload_video():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files['file']
    if not allowed_file(file.filename, ALLOWED_VIDEO):
        return jsonify({"error": "Only .mp4 and .webm files allowed"}), 400
    title = request.form.get('title', 'Untitled')
    ano = request.form.get('assignment_no', 1)
    description = request.form.get('description', '')
    due_date_str = request.form.get('due_date', '')
    due_date = None
    if due_date_str:
        try:
            due_date = datetime.datetime.fromisoformat(due_date_str)
        except ValueError:
            pass
    filename = secure_filename(f"vid_{datetime.datetime.now().timestamp()}_{file.filename}")
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    db.session.add(Session(title=title, filename=filename, assignment_no=int(ano),
                           description=description, due_date=due_date))
    db.session.commit()
    return jsonify({"msg": "Saved"})

@app.route('/teacher/set_due_date', methods=['POST'])
def set_due_date():
    data = request.json
    session = Session.query.filter_by(assignment_no=int(data['assignment_no'])).first()
    if not session:
        return jsonify({"error": "Assignment not found"}), 404
    try:
        session.due_date = datetime.datetime.fromisoformat(data['due_date'])
    except (ValueError, KeyError):
        return jsonify({"error": "Invalid date"}), 400
    db.session.commit()
    return jsonify({"msg": "Due date updated"})

@app.route('/teacher/upload_image', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files['file']
    if not allowed_file(file.filename, ALLOWED_IMAGE):
        return jsonify({"error": "Only image files allowed"}), 400
    filename = secure_filename(f"img_{datetime.datetime.now().timestamp()}_{file.filename}")
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return jsonify({"url": f"{request.host_url}uploads/{filename}"})

@app.route('/teacher/add_question', methods=['POST'])
def add_q():
    data = request.json
    db.session.add(Question(
        assignment_no=int(data['assignment_no']), text=data['text'],
        image_url=data.get('image_url'),
        opt_a=data['opt_a'], opt_b=data['opt_b'], opt_c=data['opt_c'], opt_d=data['opt_d'],
        img_a=data.get('img_a'), img_b=data.get('img_b'),
        img_c=data.get('img_c'), img_d=data.get('img_d'),
        correct_opt=data['correct_opt'], hint=data.get('hint', ''),
        difficulty=data.get('difficulty', 'medium')
    ))
    db.session.commit()
    return jsonify({"msg": "Saved"})

@app.route('/teacher/stats', methods=['GET'])
def get_stats():
    res = QuizResult.query.order_by(QuizResult.id.desc()).all()
    return jsonify([{
        "name": r.student_name, "topic": r.topic, "score": r.score,
        "prediction": r.prediction, "suggestion": r.suggestion,
        "time_taken": r.time_taken, "attempt_no": r.attempt_no,
        "created_at": r.created_at.strftime("%H:%M") if r.created_at else ""
    } for r in res])

@app.route('/teacher/leaderboard', methods=['GET'])
def leaderboard():
    results = db.session.query(
        QuizResult.student_name,
        db.func.avg(QuizResult.score).label('avg_score'),
        db.func.count(QuizResult.id).label('quizzes_taken'),
        db.func.max(QuizResult.score).label('best_score')
    ).group_by(QuizResult.student_name).order_by(db.desc('avg_score')).limit(10).all()
    return jsonify([{
        "name": r.student_name, "avg_score": round(r.avg_score, 1),
        "quizzes_taken": r.quizzes_taken, "best_score": r.best_score
    } for r in results])

@app.route('/teacher/doubts', methods=['GET'])
def teacher_get_doubts():
    doubts = Doubt.query.order_by(Doubt.created_at.desc()).all()
    return jsonify([_fmt_doubt(d) for d in doubts])

@app.route('/teacher/doubts/<int:doubt_id>/reply', methods=['POST'])
def teacher_reply(doubt_id):
    data = request.json
    doubt = Doubt.query.get_or_404(doubt_id)
    reply = DoubtReply(doubt_id=doubt_id, author=data['author'], body=data['body'])
    db.session.add(reply)
    db.session.commit()
    socketio.emit('doubt_replied', {"doubt_id": doubt_id, "reply": _fmt_reply(reply)})
    return jsonify({"msg": "Replied"})

# ── Sign of the Day ───────────────────────────────────────────────────────────
@app.route('/teacher/sign_of_day', methods=['POST'])
def set_sign_of_day():
    data = request.json
    sign = SignOfDay(
        word=data['word'], description=data['description'],
        image_url=data.get('image_url', ''), set_by=data['set_by'],
        date_set=datetime.date.today()
    )
    db.session.add(sign)
    db.session.commit()
    socketio.emit('sign_of_day', {'word': sign.word, 'description': sign.description, 'image_url': sign.image_url})
    return jsonify({"msg": "Set"})

@app.route('/sign_of_day', methods=['GET'])
def get_sign_of_day():
    sign = SignOfDay.query.order_by(SignOfDay.id.desc()).first()
    if not sign:
        return jsonify(None)
    return jsonify({
        "word": sign.word, "description": sign.description,
        "image_url": sign.image_url,
        "date": sign.date_set.strftime("%d %b %Y") if sign.date_set else ""
    })

# ── Visual Dictionary ─────────────────────────────────────────────────────────
@app.route('/teacher/dictionary', methods=['POST'])
def add_dictionary_entry():
    data = request.json
    db.session.add(DictionaryEntry(
        word=data['word'], category=data.get('category', 'General'),
        description=data.get('description', ''), image_url=data['image_url']
    ))
    db.session.commit()
    return jsonify({"msg": "Added"})

@app.route('/dictionary', methods=['GET'])
def get_dictionary():
    entries = DictionaryEntry.query.order_by(DictionaryEntry.word.asc()).all()
    return jsonify([{
        "id": e.id, "word": e.word, "category": e.category,
        "description": e.description, "image_url": e.image_url
    } for e in entries])

@app.route('/dictionary/categories', methods=['GET'])
def get_categories():
    cats = db.session.query(DictionaryEntry.category).distinct().all()
    return jsonify([c[0] for c in cats])

# ── Badges ────────────────────────────────────────────────────────────────────
@app.route('/student/badges/<string:username>', methods=['GET'])
def get_badges(username):
    badges = Badge.query.filter_by(student_name=username).all()
    return jsonify([{
        **BADGE_DEFS.get(b.badge_key, {'label': b.badge_key, 'emoji': '🏅', 'desc': ''}),
        'key': b.badge_key,
        'earned_at': b.earned_at.strftime("%d %b %Y") if b.earned_at else ""
    } for b in badges])

@app.route('/badges/all', methods=['GET'])
def all_badge_defs():
    return jsonify([{'key': k, **v} for k, v in BADGE_DEFS.items()])

# ─── STUDENT ROUTES ────────────────────────────────────────────────────────────
@app.route('/student/quiz/<int:ano>', methods=['GET'])
def get_quiz(ano):
    qs = Question.query.filter_by(assignment_no=ano).all()
    return jsonify([{
        "id": q.id, "text": q.text, "image": q.image_url, "correct": q.correct_opt,
        "a": q.opt_a, "b": q.opt_b, "c": q.opt_c, "d": q.opt_d,
        "img_a": q.img_a, "img_b": q.img_b, "img_c": q.img_c, "img_d": q.img_d,
        "hint": q.hint, "difficulty": q.difficulty
    } for q in qs])

@app.route('/student/history/<string:username>', methods=['GET'])
def student_history(username):
    res = QuizResult.query.filter_by(student_name=username).order_by(QuizResult.id.desc()).all()
    return jsonify([{
        "topic": r.topic, "score": r.score, "prediction": r.prediction,
        "attempt_no": r.attempt_no,
        "created_at": r.created_at.strftime("%d %b %H:%M") if r.created_at else ""
    } for r in res])

@app.route('/student/bookmarks/<string:username>', methods=['GET'])
def get_bookmarks(username):
    bms = Bookmark.query.filter_by(student_name=username).all()
    ids = [b.session_id for b in bms]
    sessions = Session.query.filter(Session.id.in_(ids)).all()
    return jsonify([{"id": s.id, "title": s.title, "ano": s.assignment_no} for s in sessions])

@app.route('/student/bookmark', methods=['POST'])
def toggle_bookmark():
    data = request.json
    existing = Bookmark.query.filter_by(student_name=data['username'], session_id=data['session_id']).first()
    if existing:
        db.session.delete(existing)
        db.session.commit()
        # check bookmark badge
        bm_count = Bookmark.query.filter_by(student_name=data['username']).count()
        return jsonify({"bookmarked": False})
    db.session.add(Bookmark(student_name=data['username'], session_id=data['session_id']))
    db.session.commit()
    bm_count = Bookmark.query.filter_by(student_name=data['username']).count()
    if bm_count >= 3:
        award_badge(data['username'], 'bookworm')
    return jsonify({"bookmarked": True})

@app.route('/student/doubts/<int:ano>', methods=['GET'])
def get_doubts(ano):
    doubts = Doubt.query.filter_by(assignment_no=ano).order_by(Doubt.created_at.desc()).all()
    return jsonify([_fmt_doubt(d) for d in doubts])

@app.route('/student/doubts', methods=['POST'])
def post_doubt():
    data = request.json
    if not data.get('question', '').strip():
        return jsonify({"error": "Question cannot be empty"}), 400
    doubt = Doubt(student_name=data['username'], assignment_no=int(data['assignment_no']),
                  question=data['question'].strip())
    db.session.add(doubt)
    db.session.commit()
    socketio.emit('new_doubt', _fmt_doubt(doubt))
    return jsonify(_fmt_doubt(doubt))

@app.route('/submit_quiz', methods=['POST'])
def submit():
    data = request.json
    score = int(data['score'])
    analysis = get_analysis(score)
    prev = QuizResult.query.filter_by(student_name=data['username'], topic=data['topic']).count()
    res = QuizResult(
        student_name=data['username'], topic=data['topic'], score=score,
        prediction=analysis['pred'], suggestion=analysis['sugg'],
        time_taken=data.get('time_taken'), attempt_no=prev + 1
    )
    db.session.add(res)
    db.session.commit()
    check_and_award_badges(data['username'], score, data['topic'])
    payload = {
        "name": data['username'], "topic": data['topic'], "score": score,
        "prediction": analysis['pred'], "suggestion": analysis['sugg'],
        "color": analysis['color'], "emoji": analysis['emoji'],
        "xp": analysis['xp'], "attempt_no": prev + 1
    }
    socketio.emit('new_stat', payload)
    return jsonify(payload)

# ─── SHARED ────────────────────────────────────────────────────────────────────
@app.route('/sessions', methods=['GET'])
def get_sessions():
    s = Session.query.order_by(Session.assignment_no.asc()).all()
    return jsonify([{
        "id": x.id,
        "title": x.title,
        "url": f"{request.host_url}uploads/{x.filename}",
        "ano": x.assignment_no,
        "description": x.description or "",
        "due_date": x.due_date.isoformat() if x.due_date else None
    } for x in s])

@app.route('/uploads/<filename>')
def serve(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

def _fmt_reply(r):
    return {
        "id": r.id,
        "author": r.author,
        "body": r.body,
        "created_at": r.created_at.strftime("%d %b %H:%M")
    }

def _fmt_doubt(d):
    return {
        "id": d.id,
        "student_name": d.student_name,
        "assignment_no": d.assignment_no,
        "question": d.question,
        "created_at": d.created_at.strftime("%d %b %H:%M"),
        "replies": [_fmt_reply(r) for r in d.replies]
    }
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    socketio.run(app, host='0.0.0.0', port=port)