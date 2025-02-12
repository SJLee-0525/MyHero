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

    async function fetchMessages(loginUserId) {
        if (!loginUserId) {
            console.error("유저 ID가 없습니다.")
            return;
        }
        
        setIsLoading(true);

        try {
            const startTime = "2020-01-01T00:00:00"; // ✅ 모든 메시지를 가져오기 위해 오래된 날짜 설정
            const endTime = new Date().toISOString();
            const response = await request(`${userProgressStore.DEV_API_URL}/messages/new?start=${startTime}&end=${endTime}&order=desc`)
            const resData = response.data;
            
            if (!response.success) {
                return;
            }
            
            if (!resData || resData.result === undefined) {
                return;
            }

            const selectedUserId = selectedUser.user_id;

            // ✅ `from_id` 또는 `to_id`가 현재 선택한 유저와 일치하는 메시지만 저장
            const filteredMessages = resData.result.filter(
                (msg) => 
                    (msg.from_id === loginUserId && msg.to_id === selectedUserId) || 
                    (msg.from_id === selectedUserId && msg.to_id === loginUserId)
            );

            console.log(`✅ ${selectedUserId}와 나(${loginUserId})의 대화 메시지`, filteredMessages);

            setConversations((prev) => ({
                ...prev,
                [selectedUserId]: filteredMessages.length > 0 ? filteredMessages : (prev[selectedUserId] || []),
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
        setReceivableUsers,
        selectUser,
        fetchReceivableUsers,
        fetchMessages,
        addMessage,
    }

    return (
        <MessageContext.Provider value={ctxValue}>
            {children}
        </MessageContext.Provider>
    );
}