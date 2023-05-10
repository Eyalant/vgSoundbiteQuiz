function Buttons({ location, setForceRevealAllCards, doneBtnText, setDoneBtnText }) {
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  return (
    <>
      <Navbar className="buttons">
        <Container>
          <Navbar.Brand className="mx-auto">{' '}
            <Button href={getNavBtnLink(location)} variant="outline-info">{getNavBtnText(location)}</Button>
            <Button onClick={() => setShowSummaryModal(true)} className="ms-3" variant="outline-danger">{doneBtnText}</Button>
            <SummaryModal showSummaryModal={showSummaryModal}
              setShowSummaryModal={setShowSummaryModal}
              setForceRevealAllCards={setForceRevealAllCards}
              setDoneBtnText={setDoneBtnText} />
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}

function getNavBtnText(location) {
  switch (location) {
    case 'beginning':
      return 'תוריד אותי לסוף'
    default:
      return 'תעלה אותי למעלה';
  }
}

function getNavBtnLink(location) {
  switch (location) {
    case 'beginning':
      return '#bottom';
    default:
      return '#top';
  }
}