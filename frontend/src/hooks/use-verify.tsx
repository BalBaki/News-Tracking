import { useEffect } from 'react';
import { useLazyVerifyQuery } from '../store';

const useVerify = () => {
    const [verify, verifyResult] = useLazyVerifyQuery();
    const accessTokenExpireDate = parseInt(
        document.cookie.match(`(^|;)\\s*accessTokenExpiresAt\\s*=\\s*([^;]+)`)?.pop() || ''
    );

    useEffect(() => {
        accessTokenExpireDate && verify();
    }, []);

    return {
        isLoading: verifyResult.isLoading || (accessTokenExpireDate && verifyResult.isUninitialized),
        error: verifyResult.error,
    };
};

export { useVerify };
