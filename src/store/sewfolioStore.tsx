import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { fabrics as starterFabrics, projects as starterProjects } from "../data/mockData";

const STORAGE_KEY = "sewfolio-data-v1";

const starterWorkbooks = [
  { id: "summer-sewing", title: "Summer Sewing", tint: "#F3DDD7" },
  { id: "quilted-bags", title: "Quilted Bags", tint: "#EFECE2" },
  { id: "patterns-to-try", title: "Patterns to Try", tint: "#F5EFE9" },
  { id: "gift-ideas", title: "Gift Ideas", tint: "#E9E5D9" },
];

const starterStashCollections = [
  { id: "florals", title: "Florals", tint: "#F3DDD7" },
  { id: "solids", title: "Solids", tint: "#EFECE2" },
  { id: "grunge", title: "Grunge", tint: "#F5EFE9" },
  { id: "apparel-fabric", title: "Apparel Fabric", tint: "#E9E5D9" },
];

type SewfolioContextType = {
  projects: any[];
  fabrics: any[];
  workbooks: any[];
  stashCollections: any[];
  addFabric: (fabric: any) => void;
  updateFabric: (id: string, updates: any) => void;
  deleteFabric: (id: string) => void;
  addProject: (project: any) => void;
  updateProject: (id: string, updates: any) => void;
  toggleProjectFabric: (projectId: string, fabricId: string) => void;
  addWorkbook: (workbook: any) => void;
  updateWorkbook: (id: string, title: string) => void;
  deleteWorkbook: (id: string) => void;
  addStashCollection: (collection: any) => void;
  updateStashCollection: (id: string, title: string) => void;
  deleteStashCollection: (id: string) => void;
  updateProjectProgress: (id: string, progress: number) => void;
  updateProject: (id: string, updates: any) => void;
  toggleProjectFabric: (projectId: string, fabricId: string) => void;
};

const SewfolioContext = createContext<SewfolioContextType | null>(null);

export function SewfolioProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<any[]>(starterProjects);
  const [fabrics, setFabrics] = useState<any[]>(starterFabrics);
  const [workbooks, setWorkbooks] = useState<any[]>(starterWorkbooks);
  const [stashCollections, setStashCollections] = useState<any[]>(starterStashCollections);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setProjects(parsed.projects || starterProjects);
        setFabrics(parsed.fabrics || starterFabrics);
        setWorkbooks(parsed.workbooks || starterWorkbooks);
        setStashCollections(parsed.stashCollections || starterStashCollections);
      }
      setLoaded(true);
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!loaded) return;

    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        projects,
        fabrics,
        workbooks,
        stashCollections,
      })
    );
  }, [projects, fabrics, workbooks, stashCollections, loaded]);

  function addFabric(fabric: any) {
    setFabrics((current) => [fabric, ...current]);
  }

  function updateFabric(id: string, updates: any) {
    setFabrics((current) =>
      current.map((fabric) =>
        fabric.id === id ? { ...fabric, ...updates } : fabric
      )
    );
  }

  function deleteFabric(id: string) {
    setFabrics((current) => current.filter((fabric) => fabric.id !== id));
  }

  function addProject(project: any) {
    setProjects((current) => [project, ...current]);
  }

  function updateProject(id: string, updates: any) {
    setProjects((current) =>
      current.map((project) =>
        project.id === id ? { ...project, ...updates } : project
      )
    );
  }

  function toggleProjectFabric(projectId: string, fabricId: string) {
    setProjects((current) =>
      current.map((project) => {
        if (project.id !== projectId) return project;

        const currentFabricIds = project.fabricIds || [];
        const alreadyAssigned = currentFabricIds.includes(fabricId);

        const nextFabricIds = alreadyAssigned
          ? currentFabricIds.filter((id: string) => id !== fabricId)
          : [...currentFabricIds, fabricId];

        return {
          ...project,
          fabricIds: nextFabricIds,
          fabricId: nextFabricIds[0] || "",
          fabric: nextFabricIds.length ? `${nextFabricIds.length} stash items` : "Not selected",
        };
      })
    );
  }

  function addWorkbook(workbook: any) {
    setWorkbooks((current) => [workbook, ...current]);
  }

  function updateWorkbook(id: string, title: string) {
    setWorkbooks((current) =>
      current.map((workbook) =>
        workbook.id === id ? { ...workbook, title } : workbook
      )
    );
  }

  function deleteWorkbook(id: string) {
    setWorkbooks((current) => current.filter((workbook) => workbook.id !== id));
  }

  function addStashCollection(collection: any) {
    setStashCollections((current) => [collection, ...current]);
  }

  function updateStashCollection(id: string, title: string) {
    setStashCollections((current) =>
      current.map((collection) =>
        collection.id === id ? { ...collection, title } : collection
      )
    );
  }

  function deleteStashCollection(id: string) {
    setStashCollections((current) => current.filter((collection) => collection.id !== id));
  }

  function updateProjectProgress(id: string, progress: number) {
    setProjects((current) =>
      current.map((project) =>
        project.id === id ? { ...project, progress } : project
      )
    );
  }

  function updateProject(id: string, updates: any) {
    setProjects((current) =>
      current.map((project) =>
        project.id === id ? { ...project, ...updates } : project
      )
    );
  }

  function toggleProjectFabric(projectId: string, fabricId: string) {
    setProjects((current) =>
      current.map((project) => {
        if (project.id !== projectId) return project;

        const currentFabricIds = project.fabricIds || [];
        const alreadyAssigned = currentFabricIds.includes(fabricId);

        const nextFabricIds = alreadyAssigned
          ? currentFabricIds.filter((id: string) => id !== fabricId)
          : [...currentFabricIds, fabricId];

        return {
          ...project,
          fabricIds: nextFabricIds,
          fabricId: nextFabricIds[0] || "",
          fabric: nextFabricIds.length ? `${nextFabricIds.length} stash items` : "Not selected",
        };
      })
    );
  }

  return (
    <SewfolioContext.Provider
      value={{
        projects,
        fabrics,
        workbooks,
        stashCollections,
        addFabric,
        addProject,
        updateProject,
        toggleProjectFabric,
        addWorkbook,
        updateWorkbook,
        deleteWorkbook,
        addStashCollection,
        updateStashCollection,
        deleteStashCollection,
        updateProjectProgress,
        updateProject,
      }}
    >
      {children}
    </SewfolioContext.Provider>
  );
}

export function useSewfolio() {
  const context = useContext(SewfolioContext);
  if (!context) {
    throw new Error("useSewfolio must be used inside SewfolioProvider");
  }
  return context;
}
