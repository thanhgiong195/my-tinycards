class DecksController < ApplicationController
  def show
    @deck = Deck.find_by id: params[:id]
  end

  def new
  end

  def create
    @deck = current_user.decks.build deck_params
    if @deck.save
      redirect_to @deck
    else
      render :new
    end
  end

  private

  def deck_params
    params.require(:deck).permit :cover_image, :title, :description
  end
end