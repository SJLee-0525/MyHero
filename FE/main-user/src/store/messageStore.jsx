import React from "react";
import { createContext, useState, useContext, useEffect } from "react";
import { useMainHttp } from "../hooks/useMainHttp";
import { UserProgressContext } from "./userProgressStore";

const MessageContext = createContext({
    receivableUsers: [],
    selectedUser: null,
    conversations: {},
    isLoading: false,
    fetchReceivableUsers: () => {},
    fetchMessages: () => {},
    selectUser: () => {},
    addMessage: () => {},
});

export function useMessageStore() {
    return useContext(MessageContext);
}

export default function MessageProvider({ children }) {
    const { request } = useMainHttp();
    const userProgressStore = useContext(UserProgressContext);

    const [receivableUsers, setReceivableUsers] = useState([]); // 메시지를 보낼 수 있는 사람 목록
    const [selectedUser, setSelectedUser] = useState(null); // 선택한 대화 상대
    const [conversations, setConversations] = useState({}); // 유저별 대화 저장
    const [isLoading, setIsLoading] = useState(false);

    let loginUserId = userProgressStore.loginUserInfo.userInfo?.id || "";
    
    async function fetchReceivableUsers() {
        setIsLoading(true);

        try {
            const response = await request(`${userProgressStore.DEV_API_URL}/messages/receivable/${encodeURIComponent(loginUserId)}`);
            const resData = response.data;

            if (response.success) {
                setReceivableUsers(resData.result);
            } else {
                console.error("유저 목록 가져오기 실패:", response.error);
            }
        } catch (error) {
            console.error("네트워크 오류:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function sendMessageToServer(message) {
        try {
            const response = await request(`${userProgressStore.DEV_API_URL}/messages/send`, "POST", message);
            return response;
        } catch (error) {
            console.error("❌ 메시지 전송 중 오류 발생:", error);
            return { success: false, error };
        }
    }

    async function fetchMessages(selectedUserId) {
        if (!selectedUserId || !loginUserId) {
            console.error("유저 ID가 없습니다.")
            return;
        }
        
        setIsLoading(true);

        try {
            const startTime = "2020-01-01T00:00:00"; // ✅ 모든 메시지를 가져오기 위해 오래된 날짜 설정
            const endTime = new Date().toISOString();

            // ✅ 1. 받은 메시지 불러오기
            const receivedResponse = await request(`${userProgressStore.DEV_API_URL}/messages/all?start=${startTime}&end=${endTime}&order=desc`);
            const receivedData = receivedResponse.data;

            // ✅ 2. 보낸 메시지 불러오기
            const sentResponse = await request(`${userProgressStore.DEV_API_URL}/messages/sent?start=${startTime}&end=${endTime}&order=desc`);
            const sentData = sentResponse.data;

            // ✅ 3. 서버 응답 확인
            console.log("📩 받은 메시지 원본 데이터:", receivedData.result);
            console.log("📤 보낸 메시지 원본 데이터:", sentData.result);

            if (!receivedResponse.success || !sentResponse.success) {
                console.error("❌ 메시지를 가져오지 못했습니다.");
                return;
            }

            const receivedMessages = receivedData.result.filter(
                (msg) => msg.to_id === loginUserId && msg.from_id === selectedUserId
            ).map(msg => ({
                ...msg,
                sender: "other" // 상대방이 보낸 메시지
            }));
    
            const sentMessages = sentData.result.filter(
                (msg) => msg.from_id === loginUserId && msg.to_id === selectedUserId
            ).map(msg => ({
                ...msg,
                sender: "me" // 내가 보낸 메시지
            }));

            console.log("📥 받은 메시지:", receivedMessages);
            console.log("📤 보낸 메시지:", sentMessages);

            if (sentMessages.length === 0) {
                console.warn("⚠️ 서버에서 보낸 메시지를 찾을 수 없습니다.");
            }

            const sortedMessages = [...receivedMessages, ...sentMessages].sort(
                (a, b) => new Date(a.created_at) - new Date(b.created_at)
            );

            console.log(`✅ ${selectedUserId}와의 대화 메시지 정리됨`, sortedMessages);

            // ✅ 7. conversations 상태 업데이트
            setConversations((prev) => ({
                ...prev,
                [selectedUserId]: sortedMessages.length > 0 ? sortedMessages : (prev[selectedUserId] || []),
            }));
        } catch (error) {
            console.error("❌ 네트워크 오류: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    // 특정 유저 선택 시 해당 유저의 대화 불러오기
    function selectUser(user) {
        if (!user || !user.user_id) {
            return;
        }

        setSelectedUser(user);

        // ✅ 항상 대화 목록을 최신 상태로 불러오기
        fetchMessages(user.user_id);
    }

    // 새로운 메시지 추가 (전송/수신)
    function addMessage(selectedUserId, newMessage) {
        setConversations((prev) => ({
            ...prev,
            [selectedUserId]: [...(prev[selectedUserId] || []), newMessage],
        }));
    }

    useEffect(() => {
        if (!userProgressStore?.loginUserInfo?.userInfo?.id) {
            console.log("⏳ Waiting for login...");
            return;
        }
        
        console.log("🔄 useEffect: fetchReceivableUsers 실행됨");
        fetchReceivableUsers();
    }, [userProgressStore.loginUserInfo.userInfo?.id]);

    const ctxValue = {
        receivableUsers,
        selectedUser,
        conversations,
        isLoading,
        selectUser,
        fetchReceivableUsers,
        sendMessageToServer,
        fetchMessages,
        addMessage,
    }

    return (
        <MessageContext.Provider value={ctxValue}>
            {children}
        </MessageContext.Provider>
    );
}