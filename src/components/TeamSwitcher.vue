<script setup>
import { ChevronsUpDown, Plus } from "lucide-vue-next";

import { ref } from "vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const props = defineProps({
  teams: { type: Array, required: true },
});

const { isMobile } = useSidebar();
const activeTeam = ref(props.teams[0]);
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
    
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div
              class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent  text-sidebar-primary-foreground"
            >
            <a href="/dashboard"><img src="../image/logo.png" href="logo intercop"></a>
              
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span onclick="window.location='/dashboard'" class="truncate font-semibold">
                {{ activeTeam.name }}
              </span>
              <span onclick="window.location='/dashboard'" class="truncate text-xs">{{ activeTeam.plan }}</span>
            </div>
           
          </SidebarMenuButton>
  
    </SidebarMenuItem>
  </SidebarMenu>
</template>
