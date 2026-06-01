import { useEffect, useState } from "react";

const API_URL = "https://retoolapi.dev/f1D0Zs/dataGrupo2A";

const useDataTest = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [dataTest, setDataTest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [id, setId] = useState("");
  const [cancion, setCancion] = useState("");
  const [cantante, setCantante] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");

  // Loads the records from the API and updates the list in state.
  const fetchDataTest = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("No se pudo obtener la información");
      }

      const data = await response.json();
      setDataTest(data);
    } catch (fetchError) {
      setError(fetchError.message || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  // Fetch the data once when the hook is mounted.
  useEffect(() => {
    fetchDataTest();
  }, []);

  // Clears the form fields and removes the current record id.
  const resetForm = () => {
    setId("");
    setCancion("");
    setCantante("");
    setNacionalidad("");
  };

  // Opens the form in create mode with empty values.
  const openCreateForm = () => {
    resetForm();
    setMessage("");
    setActiveTab("form");
  };

  // Loads the selected record into the form so it can be edited.
  const handleEdit = (item) => {
    setId(item.id);
    setCancion(item.cancion ?? "");
    setCantante(item.cantante ?? "");
    setNacionalidad(item.nacionalidad ?? "");
    setMessage("");
    setActiveTab("form");
  };

  // Submits the form to create a new record or update an existing one.
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const trimmedCancion = cancion.trim();
    const trimmedCantante = cantante.trim();
    const trimmedNacionalidad = nacionalidad.trim();

    if (!trimmedCancion) {
      setError("El título de la canción es obligatorio");
      return;
    }

    if (!trimmedCantante) {
      setError("El nombre del cantante es obligatorio");
      return;
    }

    if (!trimmedNacionalidad) {
      setError("La nacionalidad es obligatoria");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const payload = {
        cancion: trimmedCancion,
        cantante: trimmedCantante,
        nacionalidad: trimmedNacionalidad,
      };

      const response = await fetch(id ? `${API_URL}/${id}` : API_URL, {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(id ? "No se pudo actualizar la canción" : "No se pudo guardar la canción");
      }

      setMessage(
        id
          ? "Canción actualizada correctamente"
          : "Canción guardada correctamente",
      );
      resetForm();
      setActiveTab("list");
      fetchDataTest();
    } catch (submitError) {
      setError(submitError.message || "Error al guardar la canción");
    } finally {
      setSubmitting(false);
    }
  };

  // Deletes a record after confirmation and refreshes the list.
  const handleDelete = async (itemId) => {
    const shouldDelete =
      typeof window === "undefined"
        ? true
        : window.confirm("¿Deseas eliminar esta canción?");

    if (!shouldDelete) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch(`${API_URL}/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("No se pudo eliminar la canción");
      }

      setMessage("Canción eliminada correctamente");
      await fetchDataTest();

      if (String(id) === String(itemId)) {
        resetForm();
        setActiveTab("list");
      }
    } catch (deleteError) {
      setError(deleteError.message || "Error al eliminar la canción");
    }
  };

  return {
    activeTab,
    setActiveTab,
    dataTest,
    loading,
    submitting,
    error,
    message,
    id,
    cancion,
    setCancion,
    cantante,
    setCantante,
    nacionalidad,
    setNacionalidad,
    fetchDataTest,
    openCreateForm,
    handleEdit,
    handleSubmit,
    handleDelete,
  };
};

export default useDataTest;