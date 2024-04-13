import React, { createContext, useRef } from 'react';

const RefsContext = createContext();

export const CompanyDispatchRefsProvider = ({ children }) => {
    const refOrderNumber = useRef(null);

    return (
        <RefsContext.Provider value={{ refOrderNumber }}>
            {children}
        </RefsContext.Provider>
    );
};

export const useRefs = () => {
    return React.useContext(RefsContext);
};