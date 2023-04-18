import user from './user/route/user.route';
import wallet from './wallet/route/wallet.route';
import transactionCategory from './transactionCategory/route/transactionCategory.route';
import transaction from './transaction/route/transaction.route';
import homepage from './homepage/route/homepage.route';

// Exporting all routes as instances
export default { user, homepage, wallet, transactionCategory, transaction }