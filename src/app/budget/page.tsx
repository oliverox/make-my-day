import { UserComponentWrapper } from "~/components/userComponentWrapper";
import { BudgetSetter } from "./budgetSetter";

export default async function BudgetPage() {
  return (
    <UserComponentWrapper>
      <BudgetSetter defaultBudget='50' />
    </UserComponentWrapper>
  );
}
