import { USER_DETAILS_FAIL,USER_UPDATE_PROFILE_RESET, USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS, USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_SIGIN_FAIL, USER_SIGIN_REQUEST, USER_SIGIN_SUCCESS, USER_SIGNOUT, USER_UPDATE_PROFILE_FAIL, USER_UPDATE_PROFILE_REQUEST, USER_UPDATE_PROFILE_SUCCESS, USER_LIST_REQUEST, USER_LIST_SUCCESS, USER_LIST_FAIL, USER_DELETE_REQUEST, USER_DELETE_SUCCESS, USER_DELETE_FAIL, USER_DELETE_RESET, USER_DETAILS_RESET, USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS, USER_UPDATE_FAIL, USER_UPDATE_RESET, FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAIL, NEW_PASSWORD_REQUEST, NEW_PASSWORD_SUCCESS, NEW_PASSWORD_FAIL, FORGOT_PASSWORD_RESET, NEW_PASSWORD_RESET } from "../constants/UserConstant";

export const userSigninReducer =(state={},action)=>{
    switch (action.type) {
        case USER_SIGIN_REQUEST:
            return {loading:true};
           
        case USER_SIGIN_SUCCESS:
            return {loading:false,userInfo:action.payload};
         case USER_SIGIN_FAIL:
             return {loading:false,error:action.payload}; 
        case USER_SIGNOUT:
            return {};
        default: 
        return state;
           
    }
}
export const userRegisterReducer =(state={},action)=>{
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return {loading:true};
        case USER_REGISTER_SUCCESS:
            return {loading:false,userInfo:action.payload};
         case USER_REGISTER_FAIL:
             return {loading:false,error:action.payload};
             case USER_DETAILS_RESET:
                return { loading: true }; 
        default: 
        return state;
           
    }
}
export const userDetailsReducer=(state={loading:true},action)=>{
    switch (action.type) {
       case USER_DETAILS_REQUEST:
           return {loading:true};
        case USER_DETAILS_SUCCESS:
            return {loading:false,user:action.payload};
        case USER_DETAILS_FAIL:
              return{loading:false,error:action.payload}
        default:
           return state;
    }
}
export const userUpdateProfileReducer=(state={},action)=>{
    switch (action.type) {
        case USER_UPDATE_PROFILE_REQUEST:
            return {loading:true};
         case USER_UPDATE_PROFILE_SUCCESS:
             return {loading:false,success:true};
         case USER_UPDATE_PROFILE_FAIL:
               return{loading:false,error:action.payload}
            case USER_UPDATE_PROFILE_RESET:
                return{};
         default:
            return state;
     }
}
export const userListReducer=(state={loading:true},action)=>{
    switch (action.type) {
        case USER_LIST_REQUEST:
            return {loading:true};
         case USER_LIST_SUCCESS:
             return {loading:false,users:action.payload};
         case USER_LIST_FAIL:
               return{loading:false,error:action.payload};
         default:
            return state;
     }
}
export const userDeleteReducer = (state = {}, action) => {
    switch (action.type) {
      case USER_DELETE_REQUEST:
        return { loading: true };
      case USER_DELETE_SUCCESS:
        return { loading: false, success: true };
      case USER_DELETE_FAIL:
        return { loading: false, error: action.payload };
      case USER_DELETE_RESET:
        return {};
      default:
        return state;
    }
  };
  export const userUpdateReducer = (state = {}, action) => {
    switch (action.type) {
      case USER_UPDATE_REQUEST:
        return { loading: true };
      case USER_UPDATE_SUCCESS:
        return { loading: false, success: true };
      case USER_UPDATE_FAIL:
        return { loading: false, error: action.payload };
      case USER_UPDATE_RESET:
        return {};
      default:
        return state;
    }
  };
  export const forgotPasswordReducer  = (state = {}, action) => {
    switch (action.type) {
      case FORGOT_PASSWORD_REQUEST:
        return { loading: true };
      case FORGOT_PASSWORD_SUCCESS:
        return { loading: false, success: true };
      case FORGOT_PASSWORD_FAIL:
        return { loading: false, error: action.payload };
        case FORGOT_PASSWORD_RESET:
          return {};
      default:
        return state;
    }
  };
  export const ResetPasswordReducer  = (state = {}, action) => {
    switch (action.type) {
      case NEW_PASSWORD_REQUEST:
        return { loading: true };
      case NEW_PASSWORD_SUCCESS:
        return { loading: false, success: true };
      case NEW_PASSWORD_FAIL:
        return { loading: false, error: action.payload };
        case NEW_PASSWORD_RESET:
        return {};
    
        default:
        return state;
    }
  };
  