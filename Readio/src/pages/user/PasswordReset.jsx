import axios from "axios";
import { useState } from "react";

export default function PasswordReset() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [userId, setUserId] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1); // 1: 이메일 입력, 2: 코드 입력, 3: 비밀번호 재설정
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const sendCode = async () => {
        setMessage("");
        setError("");
        try {
            const res = await axios.post("/api/email/sendCode", { email });
            setMessage(res.data);
            setStep(2);
        } catch (err) {
            console.log("에러:", err);
            setError(err.response?.data || "인증번호 전송 실패");
        }
    };

    const verifyCode = async () => {
        setMessage("");
        setError("");
        try {
            const res = await axios.post("/api/email/verifyCode", { email, code });
            setMessage(res.data);
            setStep(3);
        } catch (err) {
            console.log("에러:", err);
            setError(err.response?.data || "인증 실패");
        }
    };

    const resetPassword = async () => {
        setMessage("");
        setError("");
        try {
            const res = await axios.post("/api/email/resetPassword", {
                userId,
                newPassword,
            });
            setMessage(res.data);
            setStep(1);
            setEmail("");
            setCode("");
            setUserId("");
            setNewPassword("");
        } catch (err) {
            console.log("에러:", err);
            setError(err.response?.data || "비밀번호 재설정 실패");
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>비밀번호 재설정</h2>

            {step === 1 && (
                <>
                    <label style={styles.label}>
                        이메일:
                        <input
                            style={styles.input}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@domain.com"
                            required
                        />
                    </label>
                    <button style={styles.button} onClick={sendCode}>
                        인증번호 보내기
                    </button>
                </>
            )}

            {step === 2 && (
                <>
                    <label style={styles.label}>
                        이메일 인증번호:
                        <input
                            style={styles.input}
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="6자리 인증번호"
                            required
                        />
                    </label>
                    <button style={styles.button} onClick={verifyCode}>
                        인증번호 확인
                    </button>
                </>
            )}

            {step === 3 && (
                <>
                    <label style={styles.label}>
                        사용자 ID:
                        <input
                            style={styles.input}
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="아이디 입력"
                            required
                        />
                    </label>
                    <label style={styles.label}>
                        새 비밀번호:
                        <input
                            style={styles.input}
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="새 비밀번호 입력"
                            required
                        />
                    </label>
                    <button style={styles.button} onClick={resetPassword}>
                        비밀번호 재설정
                    </button>
                </>
            )}

            {message && <p style={styles.message}>{message}</p>}
            {error && <p style={styles.error}>{error}</p>}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: 400,
        margin: "50px auto",
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f9f9f9",
    },
    title: {
        textAlign: "center",
        marginBottom: 20,
        color: "#333",
    },
    label: {
        display: "block",
        marginBottom: 12,
        fontWeight: "600",
        color: "#555",
    },
    input: {
        width: "100%",
        padding: "8px 12px",
        marginTop: 6,
        borderRadius: 4,
        border: "1px solid #ccc",
        boxSizing: "border-box",
        fontSize: 16,
    },
    button: {
        width: "100%",
        padding: "10px 0",
        backgroundColor: "#4CAF50",
        border: "none",
        borderRadius: 4,
        color: "white",
        fontSize: 16,
        cursor: "pointer",
        fontWeight: "600",
        marginTop: 10,
    },
    message: {
        marginTop: 15,
        color: "green",
        fontWeight: "600",
        textAlign: "center",
    },
    error: {
        marginTop: 15,
        color: "red",
        fontWeight: "600",
        textAlign: "center",
    },
};