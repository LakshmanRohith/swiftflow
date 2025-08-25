// // path: web/src/components/layout/Header.tsx

// import { Bell, Plus, Search } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useAuth } from '@/contexts/AuthContext';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Input } from '@/components/ui/input';


// export default function Header() {
//   const { user, logout } = useAuth();

//   const getInitials = (name: string) => {
//     if (!name) return '';
//     return name.split(' ').map(n => n[0]).join('').toUpperCase();
//   }

//   return (
//     <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
//       <div>
//         {/* Search Bar Placeholder */}
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//           <Input placeholder="Search tasks, projects..." className="pl-10 w-64" />
//         </div>
//       </div>
//       <div className="flex items-center space-x-4">
//         <Button size="sm">
//           <Plus className="h-4 w-4 mr-2" />
//           New
//         </Button>
//         <Button variant="ghost" size="icon">
//           <Bell className="h-5 w-5" />
//         </Button>
//         <DropdownMenu>
//           <DropdownMenuTrigger>
//              <Avatar>
//               <AvatarImage src="" alt={user?.name} />
//               <AvatarFallback>{user ? getInitials(user.name) : 'U'}</AvatarFallback>
//             </Avatar>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>My Account</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>Profile</DropdownMenuItem>
//             <DropdownMenuItem>Settings</DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={logout}>
//               Logout
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </header>
//   );
// }
// path: web/src/components/layout/Header.tsx

import { Bell, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import NewProjectDialog from '../projects/NewProjectDialog'; // Import the new component

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input placeholder="Search tasks, projects..." className="pl-10 w-64" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {/* Use the NewProjectDialog component */}
        <NewProjectDialog 
            triggerButton={
                <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New
                </Button>
            }
        />
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
             <Avatar>
              <AvatarImage src="" alt={user?.name} />
              <AvatarFallback>{user ? getInitials(user.name) : 'U'}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
