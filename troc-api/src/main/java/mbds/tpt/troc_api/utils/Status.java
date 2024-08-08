package mbds.tpt.troc_api.utils;

public enum Status {
    DISPONIBLE,
    INDISPONIBLE;

    public static Status fromString(String status) {
        try {
            return Status.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value: " + status);
        }
    }
}
