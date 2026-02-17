import Navbar from "./_components/Navbar";
import { Providers } from "./_components/Providers";

const TodoListLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Providers>
      <Navbar />
      {children}
    </Providers>
  );
};

export default TodoListLayout;
