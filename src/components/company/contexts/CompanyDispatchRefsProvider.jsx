import React, { createContext, useRef } from 'react';

const RefsContext = createContext();

export const DispatchRefsProvider = ({ children }) => {
    const inputRef1 = useRef(null);
    const inputRef2 = useRef(null);

    return (
        <RefsContext.Provider value={{ inputRef1, inputRef2 }}>
            {children}
        </RefsContext.Provider>
    );
};

export const useRefs = () => {
    return React.useContext(RefsContext);
};