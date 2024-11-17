package es.udc.fi.tfg.rest.dtos;

import java.util.List;

/**
 * The Class BlockDto.
 *
 * @param <T> the generic type
 */
public class BlockDto<T> {

    /** The items. */
    private List<T> items;
    
    /** The exist more items. */
    private boolean existMoreItems;

    /**
     * Instantiates a new block dto.
     */
    public BlockDto() {}

    /**
     * Instantiates a new block dto.
     *
     * @param items the items
     * @param existMoreItems the exist more items
     */
    public BlockDto(List<T> items, boolean existMoreItems) {

        this.items = items;
        this.existMoreItems = existMoreItems;

    }

    /**
     * Gets the items.
     *
     * @return the items
     */
    public List<T> getItems() {
        return items;
    }

    /**
     * Sets the items.
     *
     * @param items the new items
     */
    public void setItems(List<T> items) {
        this.items = items;
    }

    /**
     * Gets the exist more items.
     *
     * @return the exist more items
     */
    public boolean getExistMoreItems() {
        return existMoreItems;
    }

    /**
     * Sets the exist more items.
     *
     * @param existMoreItems the new exist more items
     */
    public void setExistMoreItems(boolean existMoreItems) {
        this.existMoreItems = existMoreItems;
    }

}