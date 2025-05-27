//로그인 전역상태
import AdminUserStateStore from 'store/userStore';

const useCheckAdmin = () => {

    const { is_master } = AdminUserStateStore(state => state);
    return is_master;
}

export default useCheckAdmin;