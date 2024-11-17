package es.udc.fi.tfg.model.services;

import java.util.List;

/**
 * The Class Block.
 *
 * @param <T> the generic type
 */
public class Block<T> {

    /** The items. */
    private List<T> items;
    
    /** The exist more items. */
    private boolean existMoreItems;

    /**
     * Instantiates a new block.
     *
     * @param items the items
     * @param existMoreItems the exist more items
     */
    public Block(List<T> items, boolean existMoreItems) {

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
     * Gets the exist more items.
     *
     * @return the exist more items
     */
    public boolean getExistMoreItems() {
        return existMoreItems;
    }

    /**
     * Hash code.
     *
     * @return the int
     */
    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + (existMoreItems ? 1231 : 1237);
        result = prime * result + ((items == null) ? 0 : items.hashCode());
        return result;
    }

    /**
     * Equals.
     *
     * @param obj the obj
     * @return true, if successful
     */
    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        @SuppressWarnings("rawtypes")
        Block other = (Block) obj;
        if (existMoreItems != other.existMoreItems)
            return false;
        if (items == null) {
            if (other.items != null)
                return false;
        } else if (!items.equals(other.items))
            return false;
        return true;
    }

}
