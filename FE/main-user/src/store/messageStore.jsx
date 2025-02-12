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

    let userId = userProgressStore.loginUserInfo.userInfo?.id || "";
    
    async function fetchReceivableUsers() {
        setIsLoading(true);
        console.log("🔄 fetchReceivableUsers() 호출됨!");

        try {
            console.log("Fetching receivable users...");
            const response = await request(`${userProgressStore.DEV_API_URL}/messages/receivable/${encodeURIComponent(userId)}`);
            const resData = response.data;
            console.log("Response received:", response);

            if (response.success) {
                console.log("Updated receivableUsers:", resData.result);
                setReceivableUsers(resData.result);
            } else {
                console.error("유저 목록 가져오기 실패:", resData.error);
            }
        } catch (error) {
            console.error("네트워크 오류:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function fetchMessages(userId) {
        setIsLoading(true);
        console.log("🔄 fetchMessages() 호출됨!");

        if (!userId) {
            console.error("유저 ID가 없습니다.")
            return;
        }

        try {
            const startTime = "2025-02-10T15:00:00";
            const endTime = "2025-02-11T14:59:59";
            const response = await request(`${userProgressStore.DEV_API_URL}/messages/new?start=${startTime}&end=${endTime}&order=desc`)
            const resData = response.data;

            if (response.success && resData.message === "New received messages retrieved successfully") {
                console.log("Updated conversation:", resData.result);
                setConversations((prev) => ({
                    ...prev,
                    [userId]: resData.result, // 해당 유저의 대화 저장
                }));
            } else {
                console.error("메세지 가져오기 실패:", resData.error);
            }
        } catch (error) {
            console.error("네트워크 오류: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    // 특정 유저 선택 시 해당 유저의 대화 불러오기
    function selectUser(user) {
        if (!user || !user.user_id) {
            console.error("Error: Invalid user object", user);
            return;
        }

        setSelectedUser(user);

        // 대화 기록이 없는 경우 서버에서 불러오기
        if (!conversations[user.user_id]) {
            fetchMessages(user.user_id);
        }
    }

    // 새로운 메시지 추가 (전송/수신)
    function addMessage(userId, newMessage) {
        setConversations((prev) => ({
            ...prev,
            [userId]: [...(prev[userId] || []), newMessage],
        }));
    }

    useEffect(() => {
        if (!userProgressStore?.loginUserInfo?.userInfo?.id) {
            console.log("⏳ Waiting for login...");
            return;
        }
        
        console.log("🔄 useEffect: fetchReceivableUsers 실행됨");
        fetchReceivableUsers();
    }, []);

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