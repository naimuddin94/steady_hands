import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { ProjectRoutes } from '../modules/Project/project.route';
import { FaqRoutes } from '../modules/FAQ/faq.route';
import { PolicyRoutes } from '../modules/Policy/policy.route';
import { TermsRoutes } from '../modules/Terms/terms.route';
import { UserSupportRoutes } from '../modules/UserSupport/userSupport.route';
import { BlogRoutes } from '../modules/Blog/blog.route';
import { GrantRoutes } from '../modules/Grant/grant.route';
import { CostRoutes } from '../modules/Cost/cost.route';
import { PaymentRoutes } from '../modules/Payment/payment.route';
import { BudgetRoutes } from '../modules/Budget/budget.route';
import { StripeRoutes } from '../modules/Stripe/stripe.routes';
import { AdminRoutes } from '../modules/Admin/admin.route';
import { LedgerRoutes } from '../modules/Ledger/ledger.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/projects',
    route: ProjectRoutes,
  },
  {
    path: '/blogs',
    route: BlogRoutes,
  },
  {
    path: '/grants',
    route: GrantRoutes,
  },
  {
    path: '/faqs',
    route: FaqRoutes,
  },
  {
    path: '/privacy-policy',
    route: PolicyRoutes,
  },
  {
    path: '/terms-and-conditions',
    route: TermsRoutes,
  },
  {
    path: '/user-support',
    route: UserSupportRoutes,
  },
  {
    path: '/costs',
    route: CostRoutes,
  },
  {
    path: '/payments',
    route: PaymentRoutes,
  },
  {
    path: '/budget',
    route: BudgetRoutes,
  },
  {
    path: '/stripe',
    route: StripeRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/ledger',
    route: LedgerRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
