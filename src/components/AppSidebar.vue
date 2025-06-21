<script setup>
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Banknote,
  Landmark
} from "lucide-vue-next";
import NavMain from '@/components/NavMain.vue';
import NavProjects from '@/components/NavProjects.vue';
import NavUser from '@/components/NavUser.vue';
import TeamSwitcher from '@/components/TeamSwitcher.vue';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

const props = defineProps({
  side: { type: String, required: false },
  variant: { type: String, required: false },
  collapsible: { type: String, required: false, default: "icon" },
  class: { type: null, required: false },
});

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  teams: [
    {
      name: "InterApp",
      logo: GalleryVerticalEnd,
      plan: "Web oficial",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Cuentas",
      url: "#",
      icon: Banknote,
      items: [
        {
          title: "Cuentas",
          url: "/dashboard/cuentas",
        },
        {
          title: "Estado de cuenta",
          url: "/dashboard/estado-cuenta",
        },
        
      ],  
    },
    {
      title: "Transferencias",
      url: "#",
      icon: Banknote,
      items: [
        {
          title: "Transferencias",
          url: "/dashboard/transferencias",
        },
        {
          title: "Historial de transferencias",
          url: "#",
        },{
          title: "Transferencias programadas",
          url: "/dashboard/transferencias-programadas",
        },
      ],
    },
    {
      title: "Creditos",
      url: "#",
      icon: Landmark,
      items: [
        {
          title: "Pago Manual",
          url: "/dashboard/pago-manual",
        },
        {
          title: "Pago Automático",
          url: "/dashboard/pago-automatico",
        },
        {
          title: "Resumen de créditos",
          url: "/dashboard/detalle-credito",
        },
      ],
    },{
      title: "Servicios",
      url: "#",
      icon: Landmark,
      items: [
        {
          title: "Pago de servicios",
          url: "/dashboard/pago-servicios",
        },
        {
          title: "Pago Automático",
          url: "#",
        },
        {
          title: "Resumen de créditos",
          url: "/dashboard/detalle-credito",
        },
      ],
    },
    

  ],

};
</script>

<template>
  <Sidebar v-bind="props" class="bg-[#002C5F] text-white">
    <SidebarHeader class="bg-[#002C5F] text-white border-b border-white/10">
      <TeamSwitcher :teams="data.teams" />
    </SidebarHeader>

    <SidebarContent class="bg-[#002C5F] text-white ">
      <NavMain :items="data.navMain" />
      <!--<NavProjects :projects="data.projects" />-->
    </SidebarContent>

    <SidebarFooter class="bg-[#002C5F] text-white border-t border-white/10">
      <NavUser :user="data.user" />
    </SidebarFooter>

    <SidebarRail class="bg-[#002C5F] text-white" />
  </Sidebar>
</template>


