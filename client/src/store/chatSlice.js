import {createSlice} from "@reduxjs/toolkit";


export const chatSlice = createSlice({
    name:"chat",
    initialState : {
        conversations : [],
        messages : [],
        messageText : "",
    },
    reducers: {
        setConversations(state,action){
            state.conversations = [...action.payload];
        },
        setMessages(state,action){
            state.messages = [...action.payload];
        },
        setMessage(state,action){
            state.messageText = action.payload;
        },
    }
})

export default chatSlice.reducer;
export const {setConversations,setMessages,setMessage} = chatSlice.actions;