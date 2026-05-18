import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { fabrics as starterFabrics, projects as starterProjects } from "../data/mockData";
import {
  createWorkbook,
  fetchWorkbooks,
  removeWorkbook,
  renameWorkbook,
} from "../services/workbooks";
import {
  createProject,
  fetchProjects,
  removeProject,
  updateProjectRecord,
} from "../services/projects";
import { replaceProjectMaterials } from "../services/projectMaterials";
import { replaceProjectSteps } from "../services/projectSteps";
import { fetchAllProjectMaterials, fetchAllProjectSteps } from "../services/projectDetails";
import {
  createStashItem,
  fetchStashItems,
  removeStashItem,
  updateStashItemRecord,
} from "../services/stashItems";
import {
  createStashCollection,
  fetchStashCollections,
  removeStashCollection,
  renameStashCollection,
} from "../services/stashCollections";

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
  deleteProject: (id: string) => Promise<void>;
  toggleProjectFabric: (projectId: string, fabricId: string) => void;
  addWorkbook: (workbook: any) => Promise<void>;
  updateWorkbook: (id: string, title: string) => Promise<void>;
  deleteWorkbook: (id: string) => Promise<void>;
  addStashCollection: (collection: any) => void;
  updateStashCollection: (id: string, title: string) => void;
  deleteStashCollection: (id: string) => void;
  updateProjectProgress: (id: string, progress: number) => void;
  updateProjectStatus: (id: string, status: string) => void;
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

      setProjects([]);
      setFabrics([]);
      setStashCollections([]);
      setWorkbooks([]);

      try {
        const remoteStashCollections = await fetchStashCollections();

        if (remoteStashCollections.length > 0) {
          setStashCollections(remoteStashCollections);
        }

        const remoteStashItems = await fetchStashItems();

        if (remoteStashItems.length > 0) {
          setFabrics(
            remoteStashItems.map((item: any) => ({
              ...item,
              collectionId: item.collection_id,
              yardage: item.amount,
            }))
          );
        }

        const remoteProjects = await fetchProjects();
        const remoteMaterials = await fetchAllProjectMaterials();
        const remoteSteps = await fetchAllProjectSteps();

        if (remoteProjects.length > 0) {
          setProjects(
            remoteProjects.map((project: any) => ({
              ...project,
              workbookId: project.workbook_id,
              sourceUrl: project.source_url,
              sourceName: project.source_name,
              image: project.hero_image,
              estimatedTime: project.estimated_time,
              materials: remoteMaterials
                .filter((item: any) => item.project_id === project.id)
                .map((item: any) => ({
                  name: item.name,
                  amount: item.amount,
                  type: item.type,
                })),
              steps: remoteSteps
                .filter((item: any) => item.project_id === project.id)
                .map((item: any) => item.text),
            }))
          );
        }

        const remoteWorkbooks = await fetchWorkbooks();

        if (remoteWorkbooks.length > 0) {
          setWorkbooks(remoteWorkbooks);
        } else {
          setWorkbooks([]);
        }
      } catch (error) {
        console.log("Failed to fetch workbooks from Supabase", error);
        setWorkbooks([]);
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

  async function addFabric(fabric: any) {
    try {
      const created = await createStashItem(fabric);

      setFabrics((current) => [
        {
          ...created,
          collectionId: created.collection_id,
          yardage: created.amount,
        },
        ...current,
      ]);
    } catch (error) {
      console.log("Failed to create stash item in Supabase", error);
      setFabrics((current) => [fabric, ...current]);
    }
  }

  async function updateFabric(id: string, updates: any) {
    setFabrics((current) =>
      current.map((fabric) =>
        fabric.id === id ? { ...fabric, ...updates } : fabric
      )
    );

    try {
      await updateStashItemRecord(id, updates);
    } catch (error) {
      console.log("Failed to update stash item in Supabase", error);
    }
  }

  async function deleteFabric(id: string) {
    setFabrics((current) => current.filter((fabric) => fabric.id !== id));

    try {
      await removeStashItem(id);
    } catch (error) {
      console.log("Failed to delete stash item in Supabase", error);
    }
  }

  async function addProject(project: any) {
    try {
      const created = await createProject(project);

      if (project.materials?.length) {
        await replaceProjectMaterials(created.id, project.materials);
      }

      if (project.steps?.length) {
        await replaceProjectSteps(created.id, project.steps);
      }

      setProjects((current) => [
        {
          ...created,
          workbookId: created.workbook_id,
          sourceUrl: created.source_url,
          sourceName: created.source_name,
          image: created.hero_image,
          estimatedTime: created.estimated_time,
          materials: project.materials || [],
          notions: project.notions || [],
          tools: project.tools || [],
          cuttingMeasurements: project.cuttingMeasurements || [],
          steps: project.steps || [],
        },
        ...current,
      ]);
    } catch (error) {
      console.log("Failed to create project in Supabase", error);
      setProjects((current) => [project, ...current]);
    }
  }

  async function updateProject(id: string, updates: any) {
    setProjects((current) =>
      current.map((project) =>
        project.id === id ? { ...project, ...updates } : project
      )
    );

    try {
      await updateProjectRecord(id, updates);
    } catch (error) {
      console.log("Failed to update project in Supabase", error);
    }
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

  async function addWorkbook(workbook: any) {
    try {
      const created = await createWorkbook(workbook.title, workbook.tint);
      setWorkbooks((current) => [created, ...current]);
    } catch (error) {
      console.log("Failed to create workbook in Supabase", error);
      setWorkbooks((current) => [workbook, ...current]);
    }
  }

  async function updateWorkbook(id: string, title: string) {
    setWorkbooks((current) =>
      current.map((workbook) =>
        workbook.id === id ? { ...workbook, title } : workbook
      )
    );

    try {
      await renameWorkbook(id, title);
    } catch (error) {
      console.log("Failed to update workbook in Supabase", error);
    }
  }

  async function deleteWorkbook(id: string) {
    setWorkbooks((current) => current.filter((workbook) => workbook.id !== id));

    try {
      await removeWorkbook(id);
    } catch (error) {
      console.log("Failed to delete workbook in Supabase", error);
    }
  }

  async function addStashCollection(collection: any) {
    try {
      const created = await createStashCollection(collection.title, collection.tint);
      setStashCollections((current) => [created, ...current]);
    } catch (error) {
      console.log("Failed to create stash collection in Supabase", error);
      setStashCollections((current) => [collection, ...current]);
    }
  }

  async function updateStashCollection(id: string, title: string) {
    setStashCollections((current) =>
      current.map((collection) =>
        collection.id === id ? { ...collection, title } : collection
      )
    );

    try {
      await renameStashCollection(id, title);
    } catch (error) {
      console.log("Failed to update stash collection in Supabase", error);
    }
  }

  async function deleteStashCollection(id: string) {
    setStashCollections((current) => current.filter((collection) => collection.id !== id));

    try {
      await removeStashCollection(id);
    } catch (error) {
      console.log("Failed to delete stash collection in Supabase", error);
    }
  }

  async function deleteProject(id: string) {
    setProjects((current) => current.filter((project) => project.id !== id));

    try {
      await removeProject(id);
    } catch (error) {
      console.log("Failed to delete project in Supabase", error);
    }
  }

  async function updateProjectStatus(id: string, status: string) {
    updateProject(id, { status });
  }

  function updateProjectProgress(id: string, progress: number) {
    setProjects((current) =>
      current.map((project) =>
        project.id === id ? { ...project, progress } : project
      )
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
        updateFabric,
        deleteFabric,
        addProject,
        updateProject,
        deleteProject,
        toggleProjectFabric,
        addWorkbook,
        updateWorkbook,
        deleteWorkbook,
        addStashCollection,
        updateStashCollection,
        deleteStashCollection,
        updateProjectProgress,
        updateProjectStatus,
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
