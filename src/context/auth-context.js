import React from 'react'

export default React.createContext({
    userId: '',
    token: '',
    login: (token, userId, tokenExpiration) => {},
    logout: () => {}
})
