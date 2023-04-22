import { createUserAccount, getUserAccountInfo, getUserAccountById, updateAccountSetting, deleteAccount } from "../controllers/auth/UserController";

const routes = (app) => {
    
    app.route('/user')
    // all
    .get((req, res, next)=> {
        // middleware
        console.log(`Request from : ${req.originalUrl}`);
        console.log(`Request from : ${req.method}`);
        next();
        
    }, getUserAccountInfo)
    app.post('/user', createUserAccount);

     // ByUserId
    app.route('/user/:userId')
    .get(getUserAccountById)
    // update Account User
    .put(updateAccountSetting)
    .delete(deleteAccount)
}

export default routes;